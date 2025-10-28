import { UserStatus } from "@prisma/client";
import { Prisma } from "../../config/prisma";
import bcrypt from "bcryptjs";

const userLogIn = async (payload: { email: string; password: string }) => {
  const isUserExsit = await Prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExsit) {
    throw new Error("user not found");
  }
  if (!isUserExsit.password) {
    throw new Error("password missing");
  }

  const matchPassword = await bcrypt.compare(
    payload.password,
    isUserExsit?.password
  );
  if (matchPassword === false) {
    throw new Error("invalid password, plase provide valid password");
  }
};
export const authServices = { userLogIn };
