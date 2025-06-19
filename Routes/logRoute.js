import express from "express"
import Log from "../Model/logSchema.js"
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const logs = await Log.find().populate("user", "name role email").sort({ createdAt: -1 });

        res.status(200).json(logs)

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch logs", error: error.message });
    }
})

export default router;