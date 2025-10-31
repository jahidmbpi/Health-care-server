import { Response, Request } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import hthpStatus from "http-status-codes";
import { userServices } from "./user.services";
import { userFilterableFields } from "./user.constant";
import pick from "../../sheard/pick";
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
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userServices.getAllUser(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All users retrieved successfully",
    data: result,
  });
});

export default getAllUser;

export const userController = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllUser,
};
