import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudenary.config";

import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      console.log("this  is multer file", file);
      const fileName = file.originalname
        .toLocaleLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-\.]/g, "");

      const extension = file.originalname.split(".").pop();
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        extension;
      return uniqueFileName;
    },
  },
});
const parser = multer({ storage: storage });
