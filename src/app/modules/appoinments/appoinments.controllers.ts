import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { appoinmentServices } from "./appoinments.services";

const createAppoinment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const patient = req.user;
  const result = await appoinmentServices.createAppoinment(patient, payload);
  sendResponse(res, {
    message: " appoinment create successfull",
    success: true,
    data: result,
    statusCode: 200,
  });
});

export const appoinmentController = {
  createAppoinment,
};
