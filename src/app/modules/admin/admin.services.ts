import { JwtPayload } from "jsonwebtoken";
import { Admin, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helper/paginationHelper";
import { Prisma as prisma } from "../../config/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { searchAbleField } from "./admin.constanr";
import AppError from "../../../helper/appError";
import httpStatus from "http-status";
import { Request } from "express";
const getAllAdmin = async (filter: any, option: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(option);
  const { searcTerm, ...filterData } = filter;
  const adnCondition: Prisma.AdminWhereInput[] = [];
  if (searcTerm) {
    adnCondition.push({
      OR: searchAbleField.map((field) => ({
        [field]: {
          contains: searcTerm,
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
    adnCondition.push(...filterCondition);
  }

  const whereCondition: Prisma.AdminWhereInput =
    adnCondition.length > 0 ? { AND: adnCondition } : {};
  const result = await prisma.admin.findMany({
    where: whereCondition,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.admin.count({
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

const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const upadeteAdmin = async (req: Request) => {
  const id = req.params.id as string;
  const user = req.user as JwtPayload;
  let payload = req.body;
  const file = req.file;

  if (typeof payload === "string") {
    payload = JSON.parse(payload);
  }
  if (payload?.data && typeof payload.data === "string") {
    payload = JSON.parse(payload.data);
  }
  if (file) {
    payload.profilePhoto = file.path;
  }

  const isAdminExsit = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!isAdminExsit) {
    throw new AppError(httpStatus.NOT_FOUND, "admin not found");
  }

  const isExsitUser = await prisma.user.findUnique({
    where: {
      email: isAdminExsit?.email,
    },
  });

  if (isExsitUser?.role === user.UserRole) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "you are not permited for this route"
    );
  }

  const result = await prisma.admin.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return result;
};
export const adminServices = {
  getAllAdmin,
  getAdminById,
  upadeteAdmin,
};
