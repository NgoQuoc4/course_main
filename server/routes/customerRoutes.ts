import { Router } from "express";
import {
    registerCustomer,
    loginCustomer,
    refreshToken,
    getProfile,
    updateProfile,
} from "../controllers/customerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../middlewares/validateMiddleware.js";
import upload from "../config/cloudinary.js";

const router = Router();

// --- Xác thực (Authentication) ---
router.post("/register", validateRegister, registerCustomer);
router.post("/login", validateLogin, loginCustomer);
router.put("/refresh", refreshToken);

// --- Hồ sơ (Profile) - yêu cầu đăng nhập ---
router.get("/profiles", protect, getProfile);
router.put(
    "/profiles",
    protect,
    upload.single("avatar"),
    updateProfile
);

export default router;
