import { Router } from "express";
import { patientController } from "./patient.controllers";

const router = Router();
router.get("/getAll-patient", patientController.getAllpatient);

export const patientRouter = router;
