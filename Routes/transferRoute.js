import express from "express"
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { createTransfer, getAllTransfers } from "../Controller/transferController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin","logistic_officer"), createTransfer);
router.get("/", protect, authorizeRoles("admin","logistic_officer"), getAllTransfers);

export default router;