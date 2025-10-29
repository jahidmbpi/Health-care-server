import { Response, Request } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import hthpStatus from "http-status-codes";
import { userServices } from "./user.services";
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);
  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.CREATED,
    message: "patient  created succefully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);
  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.CREATED,
    message: "admin created succefully",
    data: result,
  });
});
export const userController = {
  createPatient,
  createAdmin,
};
