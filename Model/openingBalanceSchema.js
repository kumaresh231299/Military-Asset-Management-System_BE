import mongoose from "mongoose";

const openingBalanceSchema = new mongoose.Schema(
    {
        base: {
            type: String,
            required: true
        },
        equipmentType: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { timestamps: true }
);

const OpeningBalance = mongoose.model("OpeningBalance", openingBalanceSchema);

export default OpeningBalance;