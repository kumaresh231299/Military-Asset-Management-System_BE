import OpeningBalance from "../Model/openingBalanceSchema.js";


//Create and update Opening Balance
export const setOpeningBalance = async (req, res) => {
    try {
        const { base, equipmentType, quantity } = req.body;

        const existing = await OpeningBalance.findOne({ base, equipmentType });

        if (existing) {
            existing.quantity = quantity;
            await existing.save();
            return res.status(200).json({ message: "Opening balance updated", OpeningBalance: existing });
        }

        const newBalance = new OpeningBalance({ base, equipmentType, quantity });
        await newBalance.save();
        res.status(201).json({ message: "Opening balance created", OpeningBalance: newBalance });

    } catch (error) {
        res.status(500).json({ message: "Failed to set opening", error: error.message });
    }
}


//Get opening balance (with filters)
export const getOpeningBalances = async (req, res) => {
    try {
        const { base, equipmentType } = req.query;

        const filter = {}
        if (base) filter.base = base;
        if (equipmentType) filter.equipmentType = equipmentType;

        const balances = await OpeningBalance.find(filter).sort({ createdAt: -1 });

        res.status(200).json(balances);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch opening balance", error: error.message });
    }
}