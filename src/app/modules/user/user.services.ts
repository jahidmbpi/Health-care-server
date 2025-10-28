import bcrypt from "bcryptjs";
import { Prisma } from "../../config/prisma";
import { Request } from "express";
import { UserRole } from "@prisma/client";

const createPatient = async (req: Request) => {
  const profilePhoto = req.file?.path as string;

  if (profilePhoto) {
    req.body.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await Prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    const createPritent = await tnx.patient.create({
      data: req.body.patient,
    });
    return createPatient;
  });
  return result;
};

export const userServices = {
  createPatient,
};
