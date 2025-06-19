import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
    {
        equipmentType: {
            type: String,
            required: true,
            enum: ["vehicle", "weapon", "ammunition"]
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        fromBase:{
            type:String,
            required:true,
        },
        toBase:{
            type:String,
            required:true
        },
        transferredBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
)

const Transfer = mongoose.model("Transfer",transferSchema);

export default Transfer;