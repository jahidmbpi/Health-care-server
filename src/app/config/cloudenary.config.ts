import { v2 as cloudinary } from "cloudinary";
import { envVars } from ".";

cloudinary.config({
  cloud_name: envVars.CLOUDENARY.CLOUDENARY_CLOUD_NAME,
  api_key: envVars.CLOUDENARY.CLOUDENARY_API_KEY,
  api_secret: envVars.CLOUDENARY.CLOUDENARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;
