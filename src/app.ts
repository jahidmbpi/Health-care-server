import express, { Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// percer
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// route
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "PH healt care server",
  });
});

export default app;
