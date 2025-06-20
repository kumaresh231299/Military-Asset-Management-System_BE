import Log from "../Model/logSchema.js";


export const logAction = async (data) => {
    try {
        console.log("Logging this action:", JSON.stringify(data, null, 2));
        const logEntry = await Log.create(data);
        console.log("Log saved:", logEntry);
    } catch (error) {
        console.log("Logging Failed", error.message);
    }
}
