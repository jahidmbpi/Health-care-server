import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import pick from "../../sheard/pick";
import { doctorfilterAblefield } from "./doctor.constant";
import { doctorServices } from "./doctor.services";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const option = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const filter = pick(req.query, doctorfilterAblefield);
  const result = await doctorServices.getAllFromDb(filter, option);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "doctor retrive succes",
    meta: result.meta,
    data: result.data,
  });
});

export const doctorController = {
  getAllFromDb,
};
