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

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const id = req.params.id;
  const result = await doctorServices.updateDoctor(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "doctor updateed succes",
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorServices.getDoctorById(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "doctor retrived succes",
    data: result,
  });
});

const deleteDoctorById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorServices.deleteDoctorById(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "delete doctor successfully",
    data: result,
  });
});

const softDeleteById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorServices.softDeleteById(id);
  sendResponse(res, {
    success: true,
    message: "delete doctor success",
    statusCode: 200,
    data: result,
  });
});

const getAiSuggession = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorServices.getAiSuggession(req.body);
  sendResponse(res, {
    success: true,
    message: "ai suggession success",
    statusCode: 200,
    data: result,
  });
});

export const doctorController = {
  getAllFromDb,
  updateDoctor,
  getDoctorById,
  deleteDoctorById,
  softDeleteById,
  getAiSuggession,
};
