import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        equipmentType: {
            type: String,
            required: true,
            enum: ["vehicle", "weapon", "ammunition"]
        },
        quantity: {
            type: Number,
            required: true
        },
        assignedTo: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["assigned", "expended"],
            default: "assigned"
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        base: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;