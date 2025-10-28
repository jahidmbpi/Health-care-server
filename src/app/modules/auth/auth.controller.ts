import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import { authServices } from "./auth.services";
import sendResponse from "../../sheard/sendResponse";
import { setCoockie } from "../../sheard/setCoockie";

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.userLogIn(req.body);
  setCoockie(res, {
    accessTocken: result.accessTocken,
    refreshTocken: result.refreshTocken,
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user log in succesfully",
    data: result,
  });
});
export const authController = { userLogin };
