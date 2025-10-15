import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.warn("No file path provided for Cloudinary upload");
      return null;
    }

    console.log("Uploading to Cloudinary:", localFilePath);

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    return res.secure_url; 
  } catch (error) {
    console.error(
      "Cloudinary upload failed for",
      localFilePath,
      "Error:",
      error || "Unknown error"
    );
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
