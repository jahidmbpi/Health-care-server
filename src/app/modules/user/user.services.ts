import bcrypt from "bcryptjs";
import { IPatient } from "./user.interface";
import { Prisma } from "../../config/prisma";
import { email } from "zod";
import { UserRole } from "@prisma/client";
import { Request } from "express";

const createPatient = async (req: Request) => {
  const parsedPatient =
    typeof req.body.patient === "string"
      ? JSON.parse(req.body.patient)
      : req.body.patient;

  const profilePhoto = req.file?.path as string;

  if (profilePhoto) {
    parsedPatient.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(parsedPatient.password, 10);
  const userData = {
    email: parsedPatient.email,
    password: hashedPassword,
  };

  delete parsedPatient.password;

  await Prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    const createPritent = await tnx.patient.create({
      data: parsedPatient,
    });
  });
  return createPatient;
};

export const userServices = {
  createPatient,
};
