/**
 * Entry Point cho Backend Server
 */
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

// 1. Xử lý Uncaught Exception
process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

// 2. Load biến môi trường
dotenv.config();

// 3. Kết nối Database
connectDB();

// 4. Khởi động Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT} - môi trường: ${process.env.NODE_ENV || "development"}`);
});

// 5. Xử lý Unhandled Rejection
process.on("unhandledRejection", (err: any) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
