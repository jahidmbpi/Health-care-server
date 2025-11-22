import { UserRole } from "@prisma/client";
import { Router } from "express";
import { doctorController } from "./doctor.controllers";
import { cheakAuth } from "../../sheard/cheakAuth";

const router = Router();
router.get("/get-all-doctor", doctorController.getAllFromDb);
router.get("/:id", doctorController.getDoctorById);
router.patch(
  "/:id",
  cheakAuth(UserRole.ADMIN, UserRole.DOCTOR),
  doctorController.updateDoctor
);
// doctor related  sob delete aita thik nah
router.delete("/:id", doctorController.deleteDoctorById);
router.delete("/soft/:id", doctorController.softDeleteById);

export const doctorRouter = router;
