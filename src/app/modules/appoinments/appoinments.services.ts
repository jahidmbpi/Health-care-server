import { Request } from "express";
import { prisma } from "../../config/prisma";
import AppError from "../../../helper/appError";
import { JwtPayload } from "jsonwebtoken";
import { uuidv4 } from "zod";

const createAppoinment = async (
  patient: JwtPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const isExsitPatient = await prisma.patient.findUnique({
    where: {
      email: patient.email,
    },
  });

  if (!isExsitPatient) {
    throw new AppError(404, "patient not found");
  }

  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: payload.doctorId,
    },
  });
  if (!doctorData) {
    throw new AppError(404, "doctor not found");
  }

  const isExsistScedule = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      scheduleId: payload.scheduleId,
      doctorId: doctorData.id,
      isBooked: false,
    },
  });
  const videoCallignId = JSON.stringify(uuidv4());

  const appoinmentData = await prisma.appoinment.create({
    data: {
      patientId: isExsitPatient.id,
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      videoCallingId: videoCallignId,
      status: "SCHEDULED",
      paymentStatus: "UNPAID",
    },
  });

  const upadateDoctorSchedule = await prisma.doctorSchedule.update({
    where: {
      doctorId_scheduleId: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
      },
    },
    data: {
      isBooked: true,
    },
  });

  return appoinmentData;
};

export const appoinmentServices = {
  createAppoinment,
};
