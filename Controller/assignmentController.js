import Assignment from "../Model/assignmentSchema.js"
import { logAction } from "../utils/logAction.js";

// Create assignment or mark as expended
export const createAssignment = async (req, res) => {
    try {
        const { equipmentType, quantity, assignedTo, status, base: bodyBase } = req.body;

        //Use base from user OR from body(for Admin)
        const base = req.user.base || bodyBase;
        if (!base) {
            return res.status(400).json({ message: "Base is required(either from user or request body)" });
        }

        const assignment = new Assignment({
            equipmentType,
            quantity,
            assignedTo,
            status,
            assignedBy: req.user._id,
            base
        });

        await assignment.save();

        await logAction({
            action: status === "expended" ? "expended" : "assignment",
            user: req.user._id,
            base: base,
            equipmentType,
            quantity,
            assignedTo,
            status
        });


        res.status(201).json({ message: "Asset assignment recorded", assignment });

    } catch (error) {
        res.status(500).json({ message: "Failed to recorded assignment", error: error.message });
    }
}


//Get all assignments(filter by base , type , status)
export const getAllAssignments = async (req, res) => {
    try {
        const { base, equipmentType, status } = req.query

        const filter = {}
        if (base) filter.base = base;
        if (equipmentType) filter.equipmentType = equipmentType;
        if (status) filter.status = status;

        const assignments = await Assignment.find(filter).populate("assignedBy", "name role").sort({ createdAt: -1 });

        res.status(200).json(assignments);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch assignments", error: error.message });
    }
}

export const markAsExpended = async (req, res) => {
    try {
        const assignmentId = req.params.id;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" })
        }

        assignment.status = "expended";
        await assignment.save();

        res.status(200).json({ message: "Asset marked as expended", assignment })

    } catch (error) {
        res.status(500).json({ message: "Failed to update assignment", error: error.message })
    }
}