import { Router } from "express";
import { doctorController } from "./doctor.controllers";

const router = Router();
router.get("/get-all-doctor", doctorController.getAllFromDb);
router.get("/:id", doctorController.getDoctorById);
router.patch("/:id", doctorController.updateDoctor);

export const doctorRouter = router;
