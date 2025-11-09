import { addHours, addMinutes, format } from "date-fns";
import { Prisma } from "../../config/prisma";

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
        `${format(currentdate, "yyyy-mm-dd")}`,
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

      const existingSchedule = await Prisma.schedule.findFirst({
        where: {
          startDateTime: scheduledata.startDateTime,
          endDateTime: scheduledata.endDateTime,
        },
      });
      if (!existingSchedule) {
        const result = await Prisma.schedule.create({
          data: scheduledata,
        });
        schedule.push(result);
      }
    }
  }

  return payload;
};

export const scheduleServices = {
  createSchedule,
};
