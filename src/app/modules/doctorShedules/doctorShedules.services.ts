import { UserRole } from "@prisma/client";
import { email } from "zod";
import { JwtPayload } from "jsonwebtoken";
import { Prisma as prisma } from "../../config/prisma";

const createDoctorSchedule = async (
  user: JwtPayload,
  payload: { scheduleIds: string[] }
) => {
  console.log(user);
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    select: {
      name: true,
      email: true,
      id: true,
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  const doctorScheduledata = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduledata,
  });

  return result;
};

export const doctorScheduleServices = {
  createDoctorSchedule,
};
