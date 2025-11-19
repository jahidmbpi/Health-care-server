import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";

import { authRouter } from "../modules/auth/auth.routes";
import { scheduleRouter } from "../modules/schedule/schedule.routes";
import { doctorShedulesRoutes } from "../modules/doctorShedules/doctorShedules.routes";
import { specialitiesRouter } from "../modules/speacialites/speacialites.routes";
import { doctorRouter } from "../modules/doctor/doctor.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/schedule",
    route: scheduleRouter,
  },
  {
    path: "/doctor-schedule",
    route: doctorShedulesRoutes,
  },
  {
    path: "/speaciality",
    route: specialitiesRouter,
  },
  {
    path: "/doctor",
    route: doctorRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
