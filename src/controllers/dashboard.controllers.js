// src/controllers/dashboard.controller.js

import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { Comment } from "../models/comment.models.js";
import { Like } from "../models/like.models.js";
import { Tweet } from "../models/tweet.models.js";

const getDashboardStats = async (req, res) => {
  const [videoCount, userCount, commentCount, likeCount, tweetCount] = await Promise.all([
    Video.countDocuments(),
    User.countDocuments(),
    Comment.countDocuments(),
    Like.countDocuments(),
    Tweet.countDocuments()
  ]);

  const stats = {
    videos: videoCount,
    users: userCount,
    comments: commentCount,
    likes: likeCount,
    tweets: tweetCount,
    fetchedAt: new Date().toISOString()
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Dashboard statistics fetched successfully"));
};

export { getDashboardStats };
