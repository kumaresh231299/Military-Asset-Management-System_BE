import express from "express"
import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { createPurchase, getAllPurchases } from "../Controller/purchaseController.js";

const router = express.Router();


//Create purchase (admin/logistic_officer)
router.post("/",protect,authorizeRoles("admin","logistic_officer"),createPurchase);

//Get all purchases (admin/logistic_officer)
router.get("/",protect,authorizeRoles("admin","logistic_officer"),getAllPurchases);


export default router;