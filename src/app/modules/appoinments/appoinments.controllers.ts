import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { appoinmentServices } from "./appoinments.services";
import pick from "../../sheard/pick";

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

const getMyAppoinment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const option = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filter = pick(req.query, ["status", "paymentStatus"]);
  const result = await appoinmentServices.getMyAppoinment(user, option, filter);
  sendResponse(res, {
    message: " appoinment feched successfull",
    success: true,
    data: result,
    statusCode: 200,
  });
});
export const appoinmentController = {
  createAppoinment,
  getMyAppoinment,
};
