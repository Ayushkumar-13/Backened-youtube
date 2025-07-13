import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ✅ Get all videos with pagination, filter, and sort
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

  const matchStage = {
    isPublished: true
  };

  if (query) {
    matchStage.title = { $regex: query, $options: "i" };
  }

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  const sortStage = {
    [sortBy]: sortType === "asc" ? 1 : -1
  };

  const aggregateQuery = Video.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        owner: {
          _id: "$owner._id",
          username: "$owner.username"
        }
      }
    },
    { $sort: sortStage }
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const videos = await Video.aggregatePaginate(aggregateQuery, options);

  res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// ✅ Publish a video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.files || !req.files.video || !req.files.thumbnail) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path);
  const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);

  if (!uploadedVideo?.url || !uploadedThumbnail?.url) {
    throw new ApiError(500, "Cloudinary upload failed");
  }

  const duration = Math.round(uploadedVideo?.duration || 0);

  const newVideo = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    title,
    description,
    duration,
    isPublished: true,
    owner: req.user._id
  });

  res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"));
});

// ✅ Get a video by ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "username");

  if (!video || !video.isPublished) {
    throw new ApiError(404, "Video not found or unpublished");
  }

  res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// ✅ Update video details
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  if (req.files?.thumbnail?.[0]) {
    const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);
    if (uploadedThumbnail?.url) {
      video.thumbnail = uploadedThumbnail.url;
    }
  }

  await video.save();

  res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

// ✅ Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  await video.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// ✅ Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to toggle this video");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res.status(200).json(new ApiResponse(200, video, `Video is now ${video.isPublished ? "Published" : "Unpublished"}`));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
};
