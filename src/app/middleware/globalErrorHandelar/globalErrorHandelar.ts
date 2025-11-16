import { Prisma } from "@prisma/client";
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
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;

  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.SERVICE_UNAVAILABLE;
    code = err.errorCode;

    if (err.errorCode === "P1000") {
      message = "Invalid database authentication. Check your DATABASE_URL.";
    } else if (err.errorCode === "P1002") {
      message =
        "Database server timeout. Ensure your DB is running and accessible.";
    }

    error = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    code = err.code;

    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT; // 409
      message = "Duplicate key error. Data already exists.";
      error = err.meta;
    }

    if (err.code === "P1001") {
      statusCode = httpStatus.SERVICE_UNAVAILABLE;
      message = "Database server is not running or unreachable.";
      error = err.meta;
    }
  }

  if (err instanceof ZodError) {
    statusCode = 400;

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
