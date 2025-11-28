import httpStatus from "http-status";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { doctorSearchAblefield } from "./doctor.constant";

import { IDoctorInput } from "./doctor.interface";
import AppError from "../../../helper/appError";
import { openai } from "../../config/open-Router";
import { retry } from "@openrouter/sdk/lib/retries.js";
import { prisma } from "../../config/prisma";
const getAllFromDb = async (filter: any, option: IPaginationOptions) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(option);
  const { searchTram, specialties, ...filterData } = filter;
  const andCondition: Prisma.DoctorWhereInput[] = [];
  if (searchTram) {
    andCondition.push({
      OR: doctorSearchAblefield.map((field) => ({
        [field]: {
          contains: searchTram,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andCondition.push({
      specialties: {
        some: {
          specialty: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andCondition.push(...filterCondition);
  }
  const whereCondition: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  const tatal = await prisma.doctor.count({
    where: whereCondition,
  });
  return {
    meta: {
      total: tatal,
      page,
      limit,
    },
    data: result,
  };
};

const updateDoctor = async (id: string, payload: Partial<IDoctorInput>) => {
  const { specialties, ...doctorData } = payload;

  const isExsitdoctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteScecialityIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const speciality of deleteScecialityIds) {
        await tnx.doctorSpecialty.deleteMany({
          where: {
            doctorId: id,
            specialtyId: speciality.specialtyId,
          },
        });
      }

      const createScecialityIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const speciality of createScecialityIds) {
        await tnx.doctorSpecialty.createMany({
          data: {
            doctorId: id,
            specialtyId: speciality.specialtyId,
          },
        });
      }
    }
    await tnx.doctor.update({
      where: {
        id: id,
      },
      data: doctorData,
    });

    return await tnx.doctor.findUnique({
      where: {
        id,
      },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  });
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "doctor not found");
  }

  return result;
};

const deleteDoctorById = async (id: string) => {
  const isExsitDoctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!isExsitDoctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  if (isExsitDoctor.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor already deleted");
  }

  const result = await prisma.$transaction(async (tnx) => {
    // 1. Delete schedules first
    const deleteSchedule = await tnx.doctorSchedule.deleteMany({
      where: {
        doctorId: isExsitDoctor.id,
      },
    });

    // 2. Delete doctorSpecialties
    const deleteSpeciality = await tnx.doctorSpecialty.deleteMany({
      where: {
        doctorId: isExsitDoctor.id,
      },
    });
    // 4. Delete doctor (LAST)
    const deletedDoctor = await tnx.doctor.delete({
      where: { id: isExsitDoctor.id },
    });
    // 3. Delete user
    const deletedUser = await tnx.user.delete({
      where: { email: isExsitDoctor.email },
    });

    return {
      deletedDoctor,
      deletedUser,
      deleteSpeciality,
      deleteSchedule,
    };
  });

  return result;
};
const softDeleteById = async (id: string) => {
  const isExsitDoctor = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (isExsitDoctor) {
    throw new AppError(404, "doctor not found");
  }

  const result = await prisma.$transaction(async (tnx) => {
    const deleteDoctor = await tnx.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
      include: {
        user: true,
        specialties: {
          include: {
            specialty: {
              include: {
                doctorSpecialties: true,
              },
            },
          },
        },
      },
    });

    await tnx.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });

  return result;
};
const getAiSuggession = async (payload: { symptoms: string }) => {
  if (!(payload && payload.symptoms)) {
    throw new AppError(httpStatus.BAD_REQUEST, "symptoms is required");
  }

  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  const systemMessage = {
    role: "system" as const,
    content:
      "You are an AI medical assistant. Based on patient symptoms and doctor data (full Prisma doctor object), return the BEST 5 doctors. Return FULL doctor objects in JSON array.",
  };

  const userMessage = {
    role: "user" as const,
    content: `
Patient Symptoms: ${payload.symptoms}

Doctor Data:
${JSON.stringify(doctors)}

Instructions:
- Analyze symptoms.
- Identify correct medical specialty.
- Select the top 5 most relevant doctors.
- If fewer than 5 exist, return as many as available.
- PRIORITIZE by: specialty match > experience > rating.
- Return ONLY a JSON array containing FULL doctor objects.
- No additional comments or explanation.
`,
  };

  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [systemMessage, userMessage],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content;

  if (!raw) {
    throw new AppError(500, "AI did not return any content");
  }

  // Convert JSON string → JavaScript object
  const aiResponse = JSON.parse(raw);

  return aiResponse;
};

export const doctorServices = {
  getAllFromDb,
  updateDoctor,
  getDoctorById,
  deleteDoctorById,
  softDeleteById,
  getAiSuggession,
};
