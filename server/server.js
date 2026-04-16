/**
 * Entry Point cho Backend Server
 */
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// 1. Xử lý Uncaught Exception (Lỗi đồng bộ nghiêm trọng)
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

// 2. Load biến môi trường
dotenv.config();

// 3. Kết nối Database
connectDB();

// 4. Import App sau khi đã config dotenv
const app = require("./app");

// 5. Khởi động Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT} - môi trường: ${process.env.NODE_ENV || "development"}`);
});

// 6. Xử lý Unhandled Rejection (Lỗi bất đồng bộ không được catch)
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
