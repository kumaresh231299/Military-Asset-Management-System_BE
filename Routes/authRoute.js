import express from "express";
import { getCurrentUser, loginUser } from "../Controller/authController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

export default router;