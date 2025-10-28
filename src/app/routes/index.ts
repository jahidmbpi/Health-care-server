import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import path from "path";
import { authRouter } from "../modules/auth/auth.routes";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
