import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;
  let code: string | undefined = err.code;
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.SERVICE_UNAVAILABLE;
    message = "Failed to initialize Prisma. Check database connection.";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    code = err.code;

    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate key error. Data already exists.";
      error = err.meta;
    }

    if (err.code === "P1001") {
      statusCode = httpStatus.SERVICE_UNAVAILABLE;
      message = "Database server is not running or unreachable.";
      error = err.meta;
    }
  }
  // if (err instanceof Prisma.PrismaClientUnknownRequestError) {
  //   if (err.message.includes("23001")) {
  //     statusCode = httpStatus.BAD_REQUEST;
  //     message = "Delete failed! This doctor has related schedules.";
  //     error = err.message;
  //   }
  // }

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;

    const formattedErrors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    message = "Validation error";
    error = formattedErrors;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
    code,
  });
};

export default globalErrorHandler;
