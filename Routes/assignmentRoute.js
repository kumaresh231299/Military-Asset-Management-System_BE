import express from "express"
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { createAssignment, getAllAssignments, markAsExpended } from "../Controller/assignmentController.js";


const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "base_commander"), createAssignment);
router.get("/", protect, authorizeRoles("admin", "base_commander", "logistic_officer"), getAllAssignments);
router.patch("/:id/mark-expended", protect, authorizeRoles("admin", "base_commander"), markAsExpended);

export default router;