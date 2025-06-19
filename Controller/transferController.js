import Transfer from "../Model/transferSchema.js";
import { logAction } from "../utils/logAction.js";


//Create Transfer
export const createTransfer = async (req, res) => {
    try {
        const { equipmentType, quantity, fromBase, toBase } = req.body;

        if (fromBase === toBase) {
            return res.status(400).json({ message: "Cannot transfer within same base" });
        }

        const transfer = new Transfer({
            equipmentType,
            quantity,
            fromBase,
            toBase,
            transferredBy: req.user._id
        })

        await transfer.save();

        await logAction({
            action: "transfer",
            user: req.user._id,
            base: fromBase,
            targetBase: toBase,
            equipmentType,
            quantity
        });


        res.status(201).json({ message: "Transfer recorded successfully", transfer });

    } catch (error) {
        res.status(500).json({ message: "Transfr failed", error: error.message })
    }
}


//Get AllTransfers
export const getAllTransfers = async (req, res) => {
    try {
        const { fromBase, toBase, equipmentType } = req.query;

        const filter = {}
        if (fromBase) filter.fromBase = fromBase;
        if (toBase) filter.toBase = toBase;
        if (equipmentType) filter.equipmentType = equipmentType;

        const transfers = await Transfer.find(filter).populate("transferredBy", "name email role").sort({ createdAt: -1 });

        res.status(200).json(transfers);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch transfers", error: error.message });
    }
}