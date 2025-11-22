import { Prisma } from "@prisma/client";
import { Prisma as prisma } from "../../config/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { searchAbleField } from "./patient.constant";
import { paginationHelper } from "../../../helper/paginationHelper";

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
  });

  return result;
};

export const patientServices = { getAllpatient };
