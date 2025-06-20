import Purchase from "../Model/purchaseSchema.js";
import Transfer from "../Model/transferSchema.js";
import Assignment from "../Model/assignmentSchema.js";
import OpeningBalance from "../Model/openingBalanceSchema.js";
import Log from "../Model/logSchema.js";

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

export const getDashboardSummary = async (req, res) => {
    try {
        // Total purchases
        const purchaseResult = await Purchase.aggregate([
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);
        const totalPurchases = purchaseResult[0]?.total || 0;

        // Total transfers
        const transferResult = await Transfer.aggregate([
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);
        const totalTransfers = transferResult[0]?.total || 0;

        // Total assignments (assigned + expended)
        const assignedResult = await Assignment.aggregate([
            { $match: { status: "assigned" } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);
        const expendedResult = await Assignment.aggregate([
            { $match: { status: "expended" } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);
        const totalAssigned = assignedResult[0]?.total || 0;
        const totalExpended = expendedResult[0]?.total || 0;

        // Base & equipmentType-wise closing balance
        const openingBalances = await OpeningBalance.find();
        const balanceSummary = [];

        for (const item of openingBalances) {
            const { base, equipmentType, quantity: openingBalance } = item;

            const [purchase] = await Purchase.aggregate([
                { $match: { base, equipmentType } },
                { $group: { _id: null, total: { $sum: "$quantity" } } }
            ]);

            const [transferIn] = await Transfer.aggregate([
                { $match: { toBase: base, equipmentType } },
                { $group: { _id: null, total: { $sum: "$quantity" } } }
            ]);

            const [transferOut] = await Transfer.aggregate([
                { $match: { fromBase: base, equipmentType } },
                { $group: { _id: null, total: { $sum: "$quantity" } } }
            ]);

            const [assigned] = await Assignment.aggregate([
                { $match: { base, equipmentType, status: "assigned" } },
                { $group: { _id: null, total: { $sum: "$quantity" } } }
            ]);

            const [expended] = await Assignment.aggregate([
                { $match: { base, equipmentType, status: "expended" } },
                { $group: { _id: null, total: { $sum: "$quantity" } } }
            ]);

            const netMovement = (purchase?.total || 0) + (transferIn?.total || 0) - (transferOut?.total || 0);
            const closingBalance = openingBalance + netMovement - (assigned?.total || 0) - (expended?.total || 0);

            balanceSummary.push({
                base,
                equipmentType,
                openingBalance,
                purchaseQty: purchase?.total || 0,
                transferInQty: transferIn?.total || 0,
                transferOutQty: transferOut?.total || 0,
                assignedQty: assigned?.total || 0,
                expendedQty: expended?.total || 0,
                closingBalance,
            });
        }

        // Recent 5 logs
        const recentLogs = await Log.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            totalPurchases,
            totalTransfers,
            totalAssigned,
            totalExpended,
            balanceSummary,
            recentLogs,
        });
    } catch (error) {
        res.status(500).json({ message: "Dashboard summary fetch failed", error: error.message });
    }
};