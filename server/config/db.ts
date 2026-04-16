import mongoose from "mongoose";

/**
 * Hàm kết nối tới MongoDB Atlas
 * Được gọi một lần khi server khởi động
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        
        const conn = await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB đã kết nối thành công: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
