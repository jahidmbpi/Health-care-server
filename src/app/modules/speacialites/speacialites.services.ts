import { Request } from "express";
import { Prisma as prisma } from "../../config/prisma";
import { Ispeacialites } from "./speacialities.interface";

const inertIntoDb = async (req: Request) => {
  const file = req.file;
  let data = req.body.data;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  if (file) {
    data.icon = file.path;
  }
  console.log(req.body.data);
  const result = await prisma.specialty.create({
    data: data,
  });
  return result;
};

export const speacialitesServices = {
  inertIntoDb,
};
