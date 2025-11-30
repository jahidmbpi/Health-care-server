import { email } from "zod";
import { prisma } from "../../config/prisma";
import AppError from "../../../helper/appError";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../config/stripe";
import { envVars } from "../../config";

const createAppoinment = async (
  patient: JwtPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const result = await prisma.$transaction(async (tnx) => {
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
    const videoCallignId = uuidv4();

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
    const transactionId = uuidv4();
    const paymentData = await prisma.payment.create({
      data: {
        appoinmentId: appoinmentData.id,
        transectionId: transactionId,
        amount: doctorData.appoinmentFee,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patient.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appoinment with ${doctorData.name}`,
            },
            unit_amount: doctorData.appoinmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appoinmentId: appoinmentData.id,
        paymentId: paymentData.id,
      },

      success_url: `https://chatgpt.com`,
      cancel_url: `https://www.youtube.com`,
    });

    return session.url;
  });

  return result;
};

export const appoinmentServices = {
  createAppoinment,
};
