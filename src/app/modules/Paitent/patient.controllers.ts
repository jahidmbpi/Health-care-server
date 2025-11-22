import { Request, Response } from "express";
import catchAsync from "../../sheard/catchAsync";
import sendResponse from "../../sheard/sendResponse";
import { patientServices } from "./patient.services";
import pick from "../../sheard/pick";
import { fillterAbleField } from "./patient.constant";

const getAllpatient = catchAsync(async (req: Request, res: Response) => {
  const option = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const filter = pick(req.query, fillterAbleField);

  const result = await patientServices.getAllpatient(filter, option);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "all patient retrive success",
    data: result,
  });
});
const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await patientServices.getPatientById(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "all patient retrive success",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await patientServices.updatePatient(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "all patient retrive success",
    data: result,
  });
});
const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await patientServices.deletePatient(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: " patient delete success",
    data: result,
  });
});
export const patientController = {
  getAllpatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
