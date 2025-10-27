import { Response, Request } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import hthpStatus from "http-status-codes";
import { userServices } from "./user.services";
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser();

  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.OK,
    massage: "  your profile retrived succesfully",
    data: result,
  });
});

export const userController = {
  createUser,
};
