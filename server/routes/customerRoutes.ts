import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    registerCustomer,
    loginCustomer,
    refreshToken,
    logoutCustomer,
    getProfile,
    updateProfile,
} from "../controllers/storefront/customerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../middlewares/validateMiddleware.js";
import upload from "../config/cloudinary.js";

const router = Router();

// Rate limiting middleware for authentication routes (login/register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Max 10 requests per IP per window
    message: {
        success: false,
        message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút!"
    },
    standardHeaders: "draft-7",
    legacyHeaders: false
});

// --- Xác thực (Authentication) ---
router.post("/register", authLimiter, validateRegister, registerCustomer);
router.post("/login", authLimiter, validateLogin, loginCustomer);
router.put("/refresh", refreshToken);
router.post("/logout", logoutCustomer);

// --- Hồ sơ (Profile) - yêu cầu đăng nhập ---
router.get("/profiles", protect, getProfile);
router.put(
    "/profiles",
    protect,
    upload.single("avatar"),
    updateProfile
);

export default router;
