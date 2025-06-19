import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { getDashboardMetrics } from "../Controller/dashboardController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "base_commander"), getDashboardMetrics);

export default router;