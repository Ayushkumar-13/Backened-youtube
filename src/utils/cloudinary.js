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

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // ✅ Cleanup temp file
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    console.log("✅ File uploaded to Cloudinary:", response.secure_url);
    return response;
  } catch (error) {
    // ❌ Delete local file if error happens
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
