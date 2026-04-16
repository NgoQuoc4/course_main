const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { errorHandler } = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError"); // I will create this file too

// Import Routes
const customerRoutes = require("./routes/customerRoutes");
const courseRoutes = require("./routes/courseRoutes");
const orderRoutes = require("./routes/orderRoutes");
const blogRoutes = require("./routes/blogRoutes");
const generalRoutes = require("./routes/generalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");

const app = express();

// ==========================================
// 1. Middlewares toàn cục
// ==========================================

// Cấu hình CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Logger HTTP request
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Parse Body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// 2. Định nghĩa Routes
// ==========================================

app.use("/api/customer", customerRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blog-categories", blogCategoryRoutes);
app.use("/api", generalRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 CFD Course API is running smoothly.",
        timestamp: new Date().toISOString(),
    });
});

// Xử lý Route không tồn tại
app.all("*", (req, res, next) => {
    next(new AppError(`Không tìm thấy route ${req.originalUrl} trên server này!`, 404));
});

// ==========================================
// 3. Global Error Handling Middleware
// ==========================================
app.use(errorHandler);

module.exports = app;
