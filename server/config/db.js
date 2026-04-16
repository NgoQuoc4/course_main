// config/db.js
// Kết nối tới MongoDB Atlas sử dụng Mongoose

const mongoose = require("mongoose");

/**
 * Hàm kết nối tới MongoDB Atlas
 * Được gọi một lần khi server khởi động
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB đã kết nối thành công: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        // Thoát tiến trình nếu không thể kết nối DB
        process.exit(1);
    }
};

module.exports = connectDB;
