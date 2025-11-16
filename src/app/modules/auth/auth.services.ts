import { UserStatus } from "@prisma/client";
import { Prisma } from "../../config/prisma";
import bcrypt from "bcryptjs";
import { createUserTocken } from "../../sheard/createUserTocken";
import { setCoockie } from "../../sheard/setCoockie";
import AppError from "../../../helper/appError";

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
    throw new AppError(404, "password missing");
  }

  const matchPassword = await bcrypt.compare(
    payload.password,
    isUserExsit?.password
  );
  if (matchPassword === false) {
    throw new AppError(404, "invalid password, plase provide valid password");
  }
  const tocken = createUserTocken(isUserExsit);

  return {
    accessTocken: tocken.accessTocken,
    refreshTocken: tocken.refreshTocken,
  };
};
export const authServices = { userLogIn };
