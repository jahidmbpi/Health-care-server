import { Router } from "express";
import { scheduleController } from "./schedule.controllers";

const router = Router();

router.post("/schedule-create", scheduleController.createSchedule);

export const scheduleRouter = router;
