import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { doctorScheduleServices } from "./doctorShedules.services";
import AppError from "../../../helper/appError";
import { JwtPayload } from "jsonwebtoken";
import pick from "../../sheard/pick";

const createDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user as JwtPayload;

  const result = await doctorScheduleServices.createDoctorSchedule(
    user,
    payload
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: " doctor schedule create  successfully",
    data: result,
  });
});

const getMyschedule = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["startdate", "endDate", "isBooked"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const user = req.user as JwtPayload;
  const result = await doctorScheduleServices.getMySchedule(
    filter,
    options,
    user
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My Schedule fetched successfully!",
    data: result,
  });
});

export const doctorScheduleController = {
  createDoctorSchedule,
  getMyschedule,
};
