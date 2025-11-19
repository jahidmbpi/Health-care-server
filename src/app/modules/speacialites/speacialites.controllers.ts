import hthpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import { speacialitesServices } from "./speacialites.services";
import sendResponse from "../../sheard/sendResponse";

const inertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await speacialitesServices.inertIntoDb(req);
  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.CREATED,
    message: "speacialites create success",
    data: result,
  });
});
const getALlDB = catchAsync(async (req: Request, res: Response) => {
  const result = await speacialitesServices.getAllDb();
  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.OK,
    message: "all speacialites retrived success",
    data: result,
  });
});
const deleteSpecialities = catchAsync(async (req: Request, res: Response) => {
  const id = req.query.id as string;
  const result = await speacialitesServices.deleteSpecialities(id);
  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.OK,
    message: " speacialites delete success",
    data: result,
  });
});

export const speacialitesController = {
  inertIntoDb,
  getALlDB,
  deleteSpecialities,
};
