import { UserRole } from "@prisma/client";
import { Router } from "express";
import { doctorController } from "./doctor.controllers";
import { cheakAuth } from "../../sheard/cheakAuth";

const router = Router();
router.post("/suggession", doctorController.getAiSuggession);
router.get("/get-all-doctor", doctorController.getAllFromDb);
router.get("/:id", doctorController.getDoctorById);
router.patch(
  "/:id",
  cheakAuth(UserRole.ADMIN, UserRole.DOCTOR),
  doctorController.updateDoctor
);
router.delete("/soft/:id", doctorController.softDeleteById);
// doctor related  sob delete aita thik nah
router.delete("/:id", doctorController.deleteDoctorById);

export const doctorRouter = router;
