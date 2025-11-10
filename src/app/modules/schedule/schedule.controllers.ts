import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { scheduleServices } from "./schedule.services";
import pick from "../../sheard/pick";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleServices.createSchedule(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "schedule create  successfully",
    data: result,
  });
});
const getSchedule = catchAsync(async (req: Request, res: Response) => {
  const fileter = pick(req.query, ["startDate", "endDate"]);
  const option = pick(req.query, ["limit", "page", "sortBy", "orderBy"]);
  const user = req.user;
  const result = await scheduleServices.getAllSchedule(fileter, option, user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "schedule retrived  successfully",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  const result = await scheduleServices.deleteSchedule(id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "schedule deleted successfully",
    data: result,
  });
});

export const scheduleController = {
  createSchedule,
  getSchedule,
  deleteSchedule,
};
