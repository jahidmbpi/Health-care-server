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

const upadeteAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.upadeteAdmin(req);
  sendResponse(res, {
    success: true,
    message: "admin update success",
    statusCode: 200,
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adminServices.deleteAdminById(id);
  sendResponse(res, {
    success: true,
    message: "admin delete success",
    statusCode: 200,
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  getAdminById,
  upadeteAdmin,
  deleteAdmin,
};
