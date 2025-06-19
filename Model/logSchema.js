import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: ["purchase", "transfer", "assignment", "expended"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        base: String,
        equipmentType: String,
        quantity: Number,
        targetBase: String,     //for transfer
        assignedTo: String,     //for assignment
        status: String          //assigned/expended
    },
    { timestamps: true }
);

const Log = mongoose.model("LOG", logSchema);

export default Log;