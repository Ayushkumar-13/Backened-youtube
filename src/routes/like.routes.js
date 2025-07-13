import express from "express";
import {
  toggleVideoLike,
  toggleCommmentLike,
  toggleTweetLike,
  getLikedVideos
} from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Base route: /api/v1/like
 */

// ✅ Toggle like on a video
router.post("/video/:videoId", verifyJWT, toggleVideoLike);

// ✅ Toggle like on a comment
router.post("/comment/:commentId", verifyJWT, toggleCommmentLike);

// ✅ Toggle like on a tweet
router.post("/tweet/:tweetId", verifyJWT, toggleTweetLike);

// ✅ Get all liked videos of the logged-in user
router.get("/videos", verifyJWT, getLikedVideos);

export default router;
