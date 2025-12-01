import { Router } from "express";
import { appoinmentController } from "./appoinments.controllers";
import { cheakAuth } from "../../sheard/cheakAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-appoinment",
  cheakAuth(UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
  appoinmentController.createAppoinment
);

router.get(
  "/my-appoinment",
  cheakAuth(UserRole.PATIENT, UserRole.DOCTOR),
  appoinmentController.getMyAppoinment
);

export const appoinmentRoute = router;
