import { Router } from "express";
import { doctorScheduleController } from "./doctorShedules.controlers";
import { cheakAuth } from "../../sheard/cheakAuth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../sheard/validaterequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
const router = Router();
router.post(
  "/doctor-schedule",
  validateRequest(DoctorScheduleValidation.create),
  cheakAuth(UserRole.DOCTOR),
  validateRequest(DoctorScheduleValidation.create),

  doctorScheduleController.createDoctorSchedule
);

router.get(
  "/my-schedule",
  cheakAuth(UserRole.DOCTOR),
  doctorScheduleController.getMyschedule
);
router.get(
  "/getAllDoctorschedule",
  cheakAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  doctorScheduleController.getAllFromDb
);
router.delete(
  "/:id",
  cheakAuth(UserRole.DOCTOR),
  doctorScheduleController.deleteSchedules
);

export const doctorShedulesRoutes = router;
