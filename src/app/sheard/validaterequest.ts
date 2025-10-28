import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let body = req.body?.data || req.body;

      if (typeof body === "string") {
        body = JSON.parse(body);
      }

      req.body = await schema.parseAsync(body);

      next();
    } catch (error) {
      next(error);
    }
  };
};
