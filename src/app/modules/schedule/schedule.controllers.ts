import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { scheduleServices } from "./schedule.services";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleServices.createSchedule(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "schedule create  successfully",
    data: result,
  });
});

export const scheduleController = {
  createSchedule,
};
