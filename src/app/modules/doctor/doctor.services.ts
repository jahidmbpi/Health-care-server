import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { doctorSearchAblefield } from "./doctor.constant";

import { Prisma as prisma } from "../../config/prisma";
const getAllFromDb = async (filter: any, option: IPaginationOptions) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(option);
  const { searchTram, ...filterData } = filter;
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

export const doctorServices = {
  getAllFromDb,
};
