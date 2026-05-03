import app from '../server/app.js';
import connectDB from '../server/config/db.js';

// Khởi tạo kết nối Database khi Vercel Serverless Function cold start
connectDB();

// Export express app để Vercel sử dụng
export default app;
