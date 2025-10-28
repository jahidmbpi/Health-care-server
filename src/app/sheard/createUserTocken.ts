import { email } from "zod";
import { Prisma, User } from "@prisma/client";
import { genarateTocken } from "./genareteTocken";
import { envVars } from "../config";

export const createUserTocken = (user: User) => {
  const jwtpayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };
  const accessTocken = genarateTocken(
    jwtpayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRE
  );

  const refreshTocken = genarateTocken(
    jwtpayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRE
  );
  return {
    accessTocken,
    refreshTocken,
  };
};
