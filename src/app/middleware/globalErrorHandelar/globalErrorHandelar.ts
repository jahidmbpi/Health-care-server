import { Request, Response, NextFunction } from "express";
import { TErrorResponse } from "../../interface/error.types";

export const globalErrorHandelar = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let Message = "something went wrong";
  let errorSources: TErrorResponse[] = [];

  if ((error.code = 1100)) {
  }
};
