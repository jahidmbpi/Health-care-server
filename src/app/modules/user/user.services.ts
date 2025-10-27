import bcrypt from "bcryptjs";
import { IPatient } from "./user.interface";
import { Prisma } from "../../config/prisma";

const createUser = async (paylod: IPatient) => {
  console.log(paylod);
  const hashedPassword = await bcrypt.hash(paylod.password, 10);

  const result = await Prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: paylod.email,
        password: hashedPassword,
      },
    });

    return await tnx.patient.create({
      data: {
        email: paylod.email,
        name: paylod.name,
      },
    });
  });
  return result;
};

export const userServices = {
  createUser,
};
