import { Router } from "express";
import { patientController } from "./patient.controllers";
import { cheakAuth } from "../../sheard/cheakAuth";
import { UserRole } from "@prisma/client";

const router = Router();
router.get("/getAll-patient", patientController.getAllpatient);
router.get(
  "/:id",
  cheakAuth(UserRole.ADMIN, UserRole.PATIENT),
  patientController.getPatientById
);
export const patientRouter = router;
