// cloudinary.js
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryUploadOptions } from "./types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = (
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
