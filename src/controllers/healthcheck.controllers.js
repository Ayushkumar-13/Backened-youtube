import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheck = (req, res) => {
  const dbState = mongoose.connection.readyState;

  const status =
    dbState === 1
      ? "connected"
      : dbState === 2
      ? "connecting"
      : dbState === 0
      ? "disconnected"
      : "disconnecting";

  res.status(200).json(
    new ApiResponse(200, {
      server: "🟢 running",
      database: `🟡 ${status}`,
      timestamp: new Date().toISOString(),
    }, "Server Health Check")
  );
};

export { healthCheck };
