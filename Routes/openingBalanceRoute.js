import express from "express"
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { getOpeningBalances, setOpeningBalance } from "../Controller/openingBalanceController.js";


const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), setOpeningBalance);
router.get("/", protect, authorizeRoles("admin", "base_commander", "logistic_officer"), getOpeningBalances);

export default router;