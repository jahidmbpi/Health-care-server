import { Request } from "express";
import { Prisma as prisma } from "../../config/prisma";
import { Ispeacialites } from "./speacialities.interface";
import AppError from "../../../helper/appError";

const inertIntoDb = async (req: Request) => {
  const file = req.file;
  let data = req.body.data;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  if (file) {
    data.icon = file.path;
  }

  const result = await prisma.specialty.create({
    data: data,
  });
  return result;
};

const getAllDb = async () => {
  const result = await prisma.specialty.findMany();
  return result;
};

const deleteSpecialities = async (id: string) => {
  const isExsitSpeciality = await prisma.specialty.findFirst({
    where: {
      id,
    },
  });

  if (!isExsitSpeciality) {
    throw new AppError(404, "speciality not found");
  }
  const result = await prisma.specialty.delete({
    where: {
      id: id,
    },
  });
  return isExsitSpeciality;
};

export const speacialitesServices = {
  inertIntoDb,
  getAllDb,
  deleteSpecialities,
};
