import express from "express";
import {
  createPlaylist,
  getUSerPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
} from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Base route: /api/v1/playlist
 */

// ✅ Create a playlist
router.post("/", verifyJWT, createPlaylist);

// ✅ Get all playlists for a user
router.get("/user/:userId", getUSerPlaylists);

// ✅ Get a playlist by ID
router.get("/:playlistId", getPlaylistById);

// ✅ Add a video to a playlist
router.post("/:playlistId/videos/:videoId", verifyJWT, addVideoToPlaylist);

// ✅ Remove a video from a playlist
router.delete("/:playlistId/videos/:videoId", verifyJWT, removeVideoFromPlaylist);

// ✅ Delete a playlist
router.delete("/:playlistId", verifyJWT, deletePlaylist);

// ✅ Update a playlist's name/description
router.put("/:playlistId", verifyJWT, updatePlaylist);

export default router;
