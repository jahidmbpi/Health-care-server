import { Router } from "express";
import { userController } from "./user.controllers";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  multerUpload.single("file"),
  userController.createPatient
);
export const userRouter = router;
