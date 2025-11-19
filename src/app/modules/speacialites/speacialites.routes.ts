import { Router } from "express";
import { speacialitesController } from "./speacialites.controllers";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.post(
  "/create-speacilite",
  multerUpload.single("file"),
  speacialitesController.inertIntoDb
);
router.get("/getall-Db", speacialitesController.getALlDB);
router.delete("/delete", speacialitesController.deleteSpecialities);

export const specialitiesRouter = router;
