import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary.
 * Supports images, PDFs, and videos.
 * For videos, generates a thumbnail automatically.
 *
 * @param {string} localFilePath - Local path of the file to upload
 * @param {string} resourceType - "image", "video", or "raw" (PDF)
 * @returns {object|null} - Returns Cloudinary response (secure_url, thumbnail, etc.) or null
 */
const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) {
      console.warn("No file path provided for Cloudinary upload");
      return null;
    }

    console.log(`Uploading to Cloudinary (${resourceType}):`, localFilePath);

    const options = { resource_type: resourceType };

    // If it's a video, generate thumbnail automatically
    if (resourceType === "video") {
      options.eager = [
        { width: 300, height: 200, crop: "thumb", format: "jpg" },
      ];
    }

    const res = await cloudinary.uploader.upload(localFilePath, options);

    // Remove local file after successful upload
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    // For videos, attach thumbnail URL if generated
    if (resourceType === "video" && res.eager?.length > 0) {
      res.thumbnail_url = res.eager[0].secure_url;
    }

    return res;
  } catch (error) {
    console.error(
      "Cloudinary upload failed for",
      localFilePath,
      "Error:",
      error
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
