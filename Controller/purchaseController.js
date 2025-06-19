import Purchase from "../Model/purchaseSchema.js";
import { logAction } from "../utils/logAction.js";

//Add a new purchase
export const createPurchase = async (req, res) => {
    try {
        const { base, equipmentType, quantity } = req.body;

        const newPurchase = new Purchase({
            base,
            equipmentType,
            quantity,
            purchasedBy: req.user._id
        });
        console.log("✅ Purchase controller entered"); // 👈 Add this at the top

        await newPurchase.save();

        await logAction({
            action: "purchase",
            user: req.user._id,
            base,
            equipmentType,
            quantity
        })

        res.status(201).json({ message: "Purchase recorded successfully", newPurchase });

    } catch (error) {
        res.status(500).json({ message: "Failed to record purchase", error: error.message });
    }
}


//Get all purchases
export const getAllPurchases = async (req, res) => {
    try {
        const { base, equipmentType } = req.query;

        const filter = {}
        if (base) filter.base = base;
        if (equipmentType) filter.equipmentType = equipmentType;

        const purchases = await Purchase.find(filter).populate("purchasedBy", "name email role").sort({ createdAt: -1 });

        res.status(200).json(purchases);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch purchases", error: error.message });
    }
}