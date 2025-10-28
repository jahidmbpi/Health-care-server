import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import { authServices } from "./auth.services";
import sendResponse from "../../sheard/sendResponse";

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.userLogIn(req.body);
  console.log(result);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user log in succesfully",
    data: result,
  });
});
export const authController = { userLogin };
