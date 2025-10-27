import { Response, Request } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import hthpStatus from "http-status-codes";
import { userServices } from "./user.services";
const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userServices.createUser(payload);

  sendResponse(res, {
    success: true,
    statusCode: hthpStatus.CREATED,
    massage: "patient  created succefully",
    data: result,
  });
});

export const userController = {
  createUser,
};
