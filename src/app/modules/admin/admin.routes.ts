import { Router } from "express";
import { adminController } from "./admin.controllers";

const router = Router();
router.get("/getAllAdmin", adminController.getAllAdmin);
router.get("/:id", adminController.getAdminById);

export const adminRouter = router;
