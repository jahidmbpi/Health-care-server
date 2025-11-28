import bcrypt from "bcryptjs";
import { Request } from "express";
import { Doctor, UserRole, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../../helper/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { prisma } from "../../config/prisma";

const createPatient = async (req: Request) => {
  const profilePhoto = req.file?.path as string | undefined;

  if (profilePhoto) {
    req.body.patient.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: userData,
    });

    const patient = await tnx.patient.create({
      data: {
        ...req.body.patient,
      },
    });
    return patient;
  });

  return result;
};

const createAdmin = async (req: Request) => {
  const profilePhoto = req.file?.path as string | undefined;

  if (profilePhoto) {
    req.body.admin.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: userData,
    });

    const admin = await tnx.admin.create({
      data: {
        ...req.body.admin,
      },
    });

    return admin;
  });

  return result;
};

const createDoctor = async (req: Request): Promise<Doctor> => {
  const profilePhoto = req.file?.path as string | undefined;

  if (profilePhoto) {
    req.body.doctor.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: userData,
    });

    const doctor = await tnx.doctor.create({
      data: req.body.doctor,
    });

    return doctor;
  });

  return result;
};

const getAllUser = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  console.log(params);
  console.log(filterData);
  const andConditions: Prisma.UserWhereInput[] = [];

  // 🔍 Search filter
  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // 🧾 Get users
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const userServices = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllUser,
};
