import express from "express";

import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js"; // Assuming you use multer

const router = express.Router();

/**
 * Base route: /api/v1/video
 */

// Get all videos (public)
router.get("/", getAllVideos);

// Get a single video (public)
router.get("/:videoId", getVideoById);

// Publish a new video (with file upload)
router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  publishAVideo
);

// Update a video
router.put(
  "/:videoId",
  verifyJWT,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateVideo
);

// Delete a video
router.delete("/:videoId", verifyJWT, deleteVideo);

// Toggle publish/unpublish
router.patch("/:videoId/toggle", verifyJWT, togglePublishStatus);

export default router;
