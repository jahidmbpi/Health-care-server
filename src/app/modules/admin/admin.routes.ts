import { Router } from "express";
import { adminController } from "./admin.controllers";
import { cheakAuth } from "../../sheard/cheakAuth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.get("/getAllAdmin", adminController.getAllAdmin);
router.get("/:id", adminController.getAdminById);
router.patch(
  "/:id",
  cheakAuth(UserRole.ADMIN),
  multerUpload.single("file"),
  adminController.upadeteAdmin
);
export const adminRouter = router;
