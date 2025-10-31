import { UserRole, UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import AppError from "../../helper/appError";
import { envVars } from "../config";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { Prisma } from "../config/prisma";

export const cheakAuth = (...allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessTocken =
        req.headers.authorization || req.cookies.accessTocken;
      if (!accessTocken) {
        throw new AppError(404, "user not found");
      }
      if (!envVars.JWT.JWT_ACCESS_SECRET) {
        throw new AppError(404, "jwt acces secrect not configure");
      }

      const verifyTocken = Jwt.verify(
        accessTocken,
        envVars.JWT.JWT_ACCESS_SECRET
      ) as JwtPayload;

      console.log(verifyTocken);

      const isUserExsit = await Prisma.user.findUnique({
        where: {
          email: verifyTocken.email,
        },
      });

      if (!isUserExsit) {
        throw new AppError(400, "you are not authorized");
      }
      const userRole = verifyTocken.role;
      if (!allowedRoles.includes(userRole)) {
        throw new AppError(403, "You are not permitted for this route");
      }

      if (
        isUserExsit.status === UserStatus.INACTIVE ||
        isUserExsit.status === UserStatus.DELETED
      ) {
        throw new AppError(400, `you are ${isUserExsit.status}`);
      }
      req.user = verifyTocken;
      next();
    } catch (error) {
      next(error);
    }
  };
};
