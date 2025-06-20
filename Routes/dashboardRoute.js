import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { getDashboardMetrics, getDashboardOverview, getDashboardSummary } from "../Controller/dashboardController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "base_commander"), getDashboardMetrics);

router.get("/stats", protect, authorizeRoles("admin", "base_commander"), getDashboardOverview);

// Summary route for dashboard cards + chart
router.get("/summary", protect, authorizeRoles("admin", "base_commander"), getDashboardSummary);

export default router;