import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        base:{
            type: String, 
            required:true
        },
        equipmentType:{
            type:String, 
            required:true,
            enum:["vehicle","weapon","ammunition"]
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        purchasedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
)

const Purchase = mongoose.model("Purchase",purchaseSchema);

export default Purchase;