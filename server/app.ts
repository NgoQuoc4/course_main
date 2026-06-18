import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { errorHandler } from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";

// Import Routes (Will need to convert these to .ts next)
import customerRoutes from "./routes/customerRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import generalRoutes from "./routes/generalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogCategoryRoutes from "./routes/blogCategoryRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// 1. Middlewares toàn cục
// ==========================================

app.use(
  cors({
    origin: (origin, callback) => {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const allowedOrigins = clientUrl
        .split(",")
        .map((url) => url.trim().replace(/\/$/, "")); // Loại bỏ dấu '/' ở cuối nếu có

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app") // Cho phép các domain preview/production của Vercel
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 CFD Course API is running smoothly.",
    timestamp: new Date().toISOString(),
  });
});

// Xử lý Route không tồn tại
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `Không tìm thấy route ${req.originalUrl} trên server này!`,
      404,
    ),
  );
});

// ==========================================
// 3. Global Error Handling Middleware
// ==========================================
app.use(errorHandler);

export default app;
