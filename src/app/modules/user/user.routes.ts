import { Router } from "express";
import { userController } from "./user.controllers";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../sheard/validaterequest";
import {
  createAdminZodSchema,
  createDoctorZodSchema,
  createPatientZodSchema,
} from "./user.validation";

const router = Router();

router.post(
  "/create",
  multerUpload.single("file"),
  validateRequest(createPatientZodSchema),
  userController.createPatient
);
router.post(
  "/create-admin",
  multerUpload.single("file"),
  validateRequest(createAdminZodSchema),
  userController.createAdmin
);
router.post(
  "/create-doctor",
  multerUpload.single("file"),
  validateRequest(createDoctorZodSchema),
  userController.createDoctor
);
export const userRouter = router;
