import express from "express";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
  getUserSubscribedChannels,
  getChannelSubscribers
} from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
/**
 * Base route: /api/v1/subscription
 */

// Subscribe to a channel
router.post("/:channelId/subscribe", verifyJWT, subscribeToChannel);

// Unsubscribe from a channel
router.delete("/:channelId/unsubscribe", verifyJWT, unsubscribeFromChannel);

// Get all channels a user is subscribed to
router.get("/user/:userId", verifyJWT, getUserSubscribedChannels);

// Get all subscribers of a channel
router.get("/channel/:channelId", verifyJWT, getChannelSubscribers);

export default router;