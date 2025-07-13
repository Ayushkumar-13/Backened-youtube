import express from "express";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Base route: /api/v1/comment
 */

// ✅ Get all comments for a video (with pagination)
router.get("/video/:videoId", getVideoComments);

// ✅ Add a comment to a video
router.post("/", verifyJWT, addComment);

// ✅ Update a comment
router.put("/:commentId", verifyJWT, updateComment);

// ✅ Delete a comment
router.delete("/:commentId", verifyJWT, deleteComment);

export default router;
