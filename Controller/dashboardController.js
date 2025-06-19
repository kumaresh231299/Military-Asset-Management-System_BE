import Purchase from "../Model/purchaseSchema.js";
import Transfer from "../Model/transferSchema.js";
import Assignment from "../Model/assignmentSchema.js";
import OpeningBalance from "../Model/openingBalanceSchema.js";

export const getDashboardMetrics = async (req, res) => {
    try {
        const { base, equipmentType, fromDate, toDate } = req.query;

        const filterDates = {}
        if (fromDate || toDate) {
            filterDates.createdAt = {}
            if (fromDate) filterDates.createdAt.$gte = new Date(fromDate);
            if (toDate) filterDates.createdAt.$lte = new Date(toDate);
        }

        //Fetch dynamic opening balance
        const openingData = await OpeningBalance.findOne({ base, equipmentType });
        const openingBalance = openingData?.quantity || 0;

        //Purchases
        const purchases = await Purchase.aggregate([
            { $match: { base, equipmentType, ...filterDates } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        //Transfers In
        const transferIn = await Transfer.aggregate([
            { $match: { toBase: base, equipmentType, ...filterDates } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        //Transfer Out
        const transferOut = await Transfer.aggregate([
            { $match: { fromBase: base, equipmentType, ...filterDates } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        //Assignments
        const assigned = await Assignment.aggregate([
            { $match: { base, equipmentType, status: "assigned", ...filterDates } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        //Expended
        const expended = await Assignment.aggregate([
            { $match: { base, equipmentType, status: "expended", ...filterDates } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const purchaseQty = purchases[0]?.total || 0;
        const transferInQty = transferIn[0]?.total || 0;
        const transferOutQty = transferOut[0]?.total || 0;
        const assignedQty = assigned[0]?.total || 0;
        const expendedQty = expended[0]?.total || 0;


        const netMovement = purchaseQty + transferInQty - transferOutQty;
        const closingBalance = openingBalance + netMovement - assignedQty - expendedQty;


        res.status(200).json({
            openingBalance,
            purchaseQty,
            transferInQty,
            transferOutQty,
            netMovement,
            assignedQty,
            expendedQty,
            closingBalance
        });

    } catch (error) {
        res.status(500).json({ message: "Dashboard fetch failed", error: error.message });
    }
}