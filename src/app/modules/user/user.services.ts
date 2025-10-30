import bcrypt from "bcryptjs";
import { Prisma } from "../../config/prisma";
import { Request } from "express";
import { Doctor, UserRole } from "@prisma/client";

const createPatient = async (req: Request) => {
  const profilePhoto = req.file?.path as string;

  if (profilePhoto) {
    req.body.patient.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await Prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: userData,
    });

    const Patient = await tnx.patient.create({
      data: req.body.patient,
    });
    return Patient;
  });
  return result;
};

const createAdmin = async (req: Request) => {
  console.log(req.body);
  const profilePhoto = req.file?.path as string;

  console.log(req.body);
  if (profilePhoto) {
    req.body.admin.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await Prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: userData,
    });

    const Admin = await tnx.admin.create({
      data: req.body.admin,
    });
    return Admin;
  });
  return result;
};

const createDoctor = async (req: Request): Promise<Doctor> => {
  const profilePhoto = req.file?.path;
  if (profilePhoto) {
    req.body.doctor.profilePhoto = profilePhoto;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await Prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: userData,
    });

    const createDoctordata = await tnx.doctor.create({
      data: req.body.doctor,
    });
    return createDoctordata;
  });
  return result;
};

const getAlluser = async () => {
  const result = await Prisma.user.findMany();
  return result;
};
export const userServices = {
  createPatient,
  createAdmin,
  createDoctor,
  getAlluser,
};
