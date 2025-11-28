import httpStatus from "http-status";

import { JwtPayload } from "jsonwebtoken";

import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import AppError from "../../../helper/appError";
import { prisma } from "../../config/prisma";

const createDoctorSchedule = async (
  user: JwtPayload,
  payload: { scheduleIds: string[] }
) => {
  console.log(payload);
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    select: {
      name: true,
      email: true,
      id: true,
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  const doctorScheduledata = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduledata,
  });

  return result;
};

const getMySchedule = async (
  filter: any,
  option: IPaginationOptions,
  user: JwtPayload
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(option);
  const { startdate, enddate, ...filterData } = filter;
  console.log(filterData);
  const condition = [];
  if (startdate && enddate) {
    condition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startdate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: enddate,
            },
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    }
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    condition.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: filterData[key],
        };
      }),
    });
  }

  const whereCondition: Prisma.DoctorScheduleWhereInput =
    condition.length > 0 ? { AND: condition } : {};

  const result = await prisma.doctorSchedule.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      option.sortBy && option.sortOrder
        ? { [option.sortBy]: option.sortOrder }
        : {},
  });

  const total = await prisma.doctorSchedule.count({
    where: whereCondition,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteSchedules = async (scheduleId: string, user: JwtPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });
  if (isBookedSchedule) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not delete the schedule because of the schedule is already booked!"
    );
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });
  return result;
};

const getAllFromDb = async (filter: any, option: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(option);
  const { searchTram, ...filterData } = filter;
  const andCondition: Prisma.DoctorScheduleWhereInput[] = [];

  if (searchTram) {
    andCondition.push({
      doctor: {
        name: {
          contains: searchTram,
          mode: "insensitive",
        },
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    if (typeof filterData.isBooked === "string") {
      filterData.isBooked = filterData.isBooked === "true";
    }

    Object.keys(filterData).forEach((key) => {
      andCondition.push({
        [key]: {
          equals: filterData[key],
        },
      });
    });
  }

  const whereCondition: Prisma.DoctorScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctorSchedule.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      option.sortBy && option.sortOrder
        ? {
            [option.sortBy]: option.sortOrder,
          }
        : {},
  });
  const total = await prisma.doctorSchedule.count({
    where: whereCondition,
  });
  console.log(whereCondition);
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
export const doctorScheduleServices = {
  createDoctorSchedule,
  getMySchedule,
  deleteSchedules,
  getAllFromDb,
};
