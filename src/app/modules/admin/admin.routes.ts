import { Router } from "express";
import { adminController } from "./admin.controllers";

const router = Router();
router.get("/getAllAdmin", adminController.getAllAdmin);

export const adminRouter = router;
