import { Router } from "express";
import { scheduleController } from "./schedule.controllers";

const router = Router();

router.post("/schedule-create", scheduleController.createSchedule);
router.get("/getAllschedule", scheduleController.getSchedule);

export const scheduleRouter = router;
