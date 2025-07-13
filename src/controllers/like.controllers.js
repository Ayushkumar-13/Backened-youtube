import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Video unliked successfully"));
    }

    const newLike = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    res
        .status(201)
        .json(new ApiResponse(201, newLike, "Video liked successfully"));
});

// ✅ Toggle like on a comment
const toggleCommmentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Comment unliked successfully"));
    }

    const newLike = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    res
        .status(201)
        .json(new ApiResponse(201, newLike, "Comment liked successfully"));
});

// ✅ Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
    }

    const newLike = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    });

    res
        .status(201)
        .json(new ApiResponse(201, newLike, "Tweet liked successfully"));
});

// ✅ Get all liked videos by a user
const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null }
    }).populate("video");

    const likedVideos = likes.map((like) => like.video);

    res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
    toggleCommmentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
