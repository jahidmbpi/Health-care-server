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
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);
  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.CREATED,
    message: "doctor created succefully",
    data: result,
  });
});
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAlluser();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "get all user retrive success",
    data: result,
  });
});
export const userController = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllUser,
};
