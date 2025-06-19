import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Databse/config.js";
import morgan from "morgan";
import authRoute from "./Routes/authRoute.js"
import { protect } from "./Middleware/authMiddleware.js";
import { authorizeRoles } from "./Middleware/roleMiddleware.js";
import purchaseRoute from "./Routes/purchaseRoute.js"
import transferRoute from "./Routes/transferRoute.js"
import assignmentRoute from "./Routes/assignmentRoute.js"
import dashboardRoute from "./Routes/dashboardRoute.js"
import openingBalanceRoute from "./Routes/openingBalanceRoute.js"
import logRoute from "./Routes/logRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(morgan('dev'));

//DB Connection
connectDB();

//Default Route
app.get("/", (req, res) => {
    res.status(200).send("Hi, Welcome to our Military Asset Management System....");
});

app.get('/api/sk-mams/admin', protect, authorizeRoles('admin'), (req, res) => {
    res.send(`Welcome Admin : ${req.user.name}`)
})

//Auth Route
app.use("/api/sk-mams/auth", authRoute);
app.use("/api/sk-mams/purchases", purchaseRoute);
app.use("/api/sk-mams/transfers", transferRoute);
app.use("/api/sk-mams/assignments", assignmentRoute);
app.use("/api/sk-mams/dashboard", dashboardRoute);
app.use("/api/sk-mams/opening-balance", openingBalanceRoute);
app.use("/api/sk-mams/logs", logRoute);

//Listen
app.listen(PORT, () => {
    console.log("App is started and running on the port", PORT);
})