import { Router } from "express";
import { doctorScheduleController } from "./doctorShedules.controlers";
import { cheakAuth } from "../../sheard/cheakAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/doctor-schedule",
  cheakAuth(UserRole.DOCTOR),
  doctorScheduleController.createDoctorSchedule
);

export const doctorShedulesRoutes = router;
