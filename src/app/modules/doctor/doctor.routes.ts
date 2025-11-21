import { Router } from "express";
import { doctorController } from "./doctor.controllers";

const router = Router();
router.get("/get-all-doctor", doctorController.getAllFromDb);
router.get("/:id", doctorController.getDoctorById);
router.patch("/:id", doctorController.updateDoctor);
// doctor related  sob delete aita thik nah
router.delete("/:id", doctorController.deleteDoctorById);

export const doctorRouter = router;
