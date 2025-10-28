import { v2 as cloudinary } from "cloudinary";
import { envVars } from ".";

cloudinary.config({
  cloud_name: envVars.CLOUDENARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDENARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDENARY.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;
