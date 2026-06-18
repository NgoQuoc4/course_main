/**
 * Entry Point cho Backend Server
 */
import dotenv from "dotenv";
import prisma from "./config/prisma.js";
import app from "./app.js";

// 1. Xử lý Uncaught Exception
process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

// 2. Load biến môi trường
dotenv.config();

// Kiểm tra các biến môi trường thiết yếu
const REQUIRED_ENV = [
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];

const missingEnv = REQUIRED_ENV.filter((env) => !process.env[env]);
if (missingEnv.length > 0) {
    console.error(`💥 LỖI KHỞI ĐỘNG: Thiếu cấu hình các biến môi trường thiết yếu:\n   👉 ${missingEnv.join(", ")}\n`);
    process.exit(1);
}

// 3. Kết nối Database (Prisma)
try {
    await prisma.$connect();
    console.log("✅ Cơ sở dữ liệu MongoDB đã kết nối thành công qua Prisma.");
} catch (error: any) {
    console.error(`❌ Lỗi kết nối MongoDB qua Prisma: ${error.message}`);
    process.exit(1);
}

// 4. Khởi động Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT} - môi trường: ${process.env.NODE_ENV || "development"}`);
});

// Bắt lỗi cụ thể của server (ví dụ: EADDRINUSE)
server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        console.error(`💥 Lỗi: Cổng ${PORT} đã được sử dụng. Hãy giải phóng cổng này hoặc sử dụng cổng khác!`);
        process.exit(1);
    } else {
        console.error("💥 Lỗi server:", err.message);
        process.exit(1);
    }
});

// 5. Xử lý Unhandled Rejection
process.on("unhandledRejection", (err: any) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
