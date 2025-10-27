import { Router } from "express";
import { userController } from "./user.controllers";

const router = Router();

router.post("/create", userController.createUser);
export const userRouter = router;
