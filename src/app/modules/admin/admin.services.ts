import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helper/paginationHelper";
import { Prisma as prisma } from "../../config/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { searchAbleField } from "./admin.constanr";

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
export const adminServices = {
  getAllAdmin,
  getAdminById,
};
