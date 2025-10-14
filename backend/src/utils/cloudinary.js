import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(`cloudinary url: ${res.secure_url}`);
    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    console.log("cloudinary error", error.message);
    fs.unlinkSync(localFilePath);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
