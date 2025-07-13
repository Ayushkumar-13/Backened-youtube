// src/routes/dashboard.routes.js

import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/v1/dashboard
router.get("/", verifyJWT, getDashboardStats);

export default router;
