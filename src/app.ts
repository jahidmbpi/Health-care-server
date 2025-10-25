import express, { Request, Response } from "express";
import cors from "cors";
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

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "PH healt care server",
  });
});

export default app;
