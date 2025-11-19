import { Router } from "express";
import { speacialitesController } from "./speacialites.controllers";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.post(
  "/create-speacilite",
  multerUpload.single("file"),
  speacialitesController.inertIntoDb
);

export const specialitiesRouter = router;
