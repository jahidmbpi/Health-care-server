import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import pick from "../../sheard/pick";
import { filterAbleField } from "./admin.constanr";
import { adminServices } from "./admin.services";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const option = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const filter = pick(req.query, filterAbleField);
  const result = await adminServices.getAllAdmin(filter, option);
  sendResponse(res, {
    success: true,
    message: "all admin retrived success",
    data: result,
    statusCode: 200,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adminServices.getAdminById(id);
  sendResponse(res, {
    success: true,
    message: " admin retrived success",
    data: result,
    statusCode: 200,
  });
});

export const adminController = {
  getAllAdmin,
  getAdminById,
};
