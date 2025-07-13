import express from "express";
import {
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

/**
 * @route   GET /api/v1/video
 * @desc    Get all published videos
 * @access  Public
 */
router.get("/", getAllVideos);

/**
 * @route   GET /api/v1/video/:videoId
 * @desc    Get a specific video by ID
 * @access  Public
 */
router.get("/:videoId", getVideoById);

/**
 * @route   POST /api/v1/video
 * @desc    Upload and publish a new video
 * @access  Private
 */
router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

/**
 * @route   PUT /api/v1/video/:videoId
 * @desc    Update video details (title, description, thumbnail)
 * @access  Private
 */
router.put(
  "/:videoId",
  verifyJWT,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateVideo
);

/**
 * @route   DELETE /api/v1/video/:videoId
 * @desc    Delete a video
 * @access  Private
 */
router.delete("/:videoId", verifyJWT, deleteVideo);

/**
 * @route   PATCH /api/v1/video/:videoId/toggle
 * @desc    Toggle publish/unpublish status
 * @access  Private
 */
router.patch("/:videoId/toggle", verifyJWT, togglePublishStatus);

export default router;
