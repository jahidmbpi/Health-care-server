import { IAuthUser } from "./../auth/auth.interface";
import httpStatus from "http-status";
import { Prisma, UserStatus } from "@prisma/client";

import { IPaginationOptions } from "../../interface/pagination";
import { searchAbleField } from "./patient.constant";
import { paginationHelper } from "../../../helper/paginationHelper";
import AppError from "../../../helper/appError";
import { IPatient } from "./patient.interface";
import { prisma } from "../../config/prisma";

const getAllpatient = async (filter: any, option: IPaginationOptions) => {
  const { searchTram, ...filterData } = filter;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(option);

  console.log(limit);
  const andCondition: Prisma.PatientWhereInput[] = [];
  if (searchTram) {
    andCondition.push({
      OR: searchAbleField.map((field) => ({
        [field]: {
          contains: searchTram,
          mode: "insensitive",
        },
      })),
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
  const whereCondition: Prisma.PatientWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy as any]: sortOrder,
    },
    include: {
      user: true,
    },
  });

  const total = await prisma.patient.count({
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

const getPatientById = async (id: string) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  const userData = await prisma.user.findUnique({
    where: {
      email: patientData?.email,
    },
  });
  if (
    userData?.status === UserStatus.INACTIVE ||
    userData?.status === UserStatus.DELETED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this user not permitted on this site. please contact admin or higher authority"
    );
  }
  return patientData;
};

const updatePatient = async (id: string, payload: Partial<IPatient>) => {
  const UpdatedPatient = await prisma.patient.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
  });
  return UpdatedPatient;
};

const deletePatient = async (id: string) => {
  const UpdatedPatient = await prisma.patient.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return UpdatedPatient;
};
export const patientServices = {
  getAllpatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
