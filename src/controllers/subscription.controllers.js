import mongoose from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Subscribe to a channel
const subscribeToChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (req.user._id.toString() === channelId) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const existing = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    if (existing) {
        throw new ApiError(400, "Already subscribed to this channel");
    }

    const subscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    res.status(201).json(
        new ApiResponse(201, subscription, "Subscribed successfully")
    );
});

// ✅ Unsubscribe from a channel
const unsubscribeFromChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscription = await Subscription.findOneAndDelete({
        subscriber: req.user._id,
        channel: channelId
    });

    if (!subscription) {
        throw new ApiError(404, "Subscription not found");
    }

    res.status(200).json(
        new ApiResponse(200, {}, "Unsubscribed successfully")
    );
});

// ✅ Get all channels the user is subscribed to
const getUserSubscribedChannels = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const subscriptions = await Subscription.find({ subscriber: userId })
        .populate("channel", "username email");

    const channels = subscriptions.map(sub => sub.channel);

    res.status(200).json(
        new ApiResponse(200, channels, "Subscribed channels fetched")
    );
});

// ✅ Get all subscribers of a channel
const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username email");

    const users = subscribers.map(sub => sub.subscriber);

    res.status(200).json(
        new ApiResponse(200, users, "Channel subscribers fetched")
    );
});

export {
    subscribeToChannel,
    unsubscribeFromChannel,
    getUserSubscribedChannels,
    getChannelSubscribers
};
