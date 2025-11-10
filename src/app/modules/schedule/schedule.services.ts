import { addHours, addMinutes, format } from "date-fns";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../../helper/paginationHelper";

import { Prisma as prisma } from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { IAuthUser } from "../auth/auth.interface";
import { JwtPayload } from "jsonwebtoken";

const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const currentdate = new Date(startDate);
  const lastDate = new Date(endDate);
  const interval = 30;
  const schedule = [];

  while (currentdate <= lastDate) {
    const startDateTime = addMinutes(
      addHours(
        new Date(format(currentdate, "yyyy-MM-dd")),
        Number(startTime.split(":")[0])
      ),
      Number(startTime.split(":")[1])
    );

    const endDateTime = addMinutes(
      addHours(
        `${format(currentdate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      ),
      Number(endTime.split(":")[1])
    );
    while (startDateTime < endDateTime) {
      const slotStartTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, interval);

      const scheduledata = {
        startDateTime: slotStartTime,
        endDateTime: slotEndDateTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduledata.startDateTime,
          endDateTime: scheduledata.endDateTime,
        },
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduledata,
        });
        schedule.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }
    currentdate.setDate(currentdate.getDate() + 1);
  }

  return schedule;
};

const getAllSchedule = async (
  fileter: any,
  option: IPaginationOptions,
  user: JwtPayload
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(option);
  const { startdate, endDate, ...filterData } = fileter;
  const andCondition = [];
  if (startdate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startdate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const wherecondition: Prisma.ScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });
  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...wherecondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      option.sortBy && option.sortOrder
        ? {
            [option.sortBy]: option.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const totale = await prisma.schedule.count({
    where: {
      ...wherecondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
  });
  return {
    meta: {
      totale,
      page,
      limit,
    },
    data: result,
  };
};
const deleteSchedule = async (id: string) => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};
export const scheduleServices = {
  createSchedule,
  getAllSchedule,
  deleteSchedule,
};
