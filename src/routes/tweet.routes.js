import express from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
} from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Base route: /api/v1/tweet
 */

// Create a tweet
router.post("/", verifyJWT, createTweet);

// Get all tweets of a user
router.get("/user/:userId", getUserTweets);

// Update a tweet
router.put("/:tweetId", verifyJWT, updateTweet);

// Delete a tweet
router.delete("/:tweetId", verifyJWT, deleteTweet);

export default router;
