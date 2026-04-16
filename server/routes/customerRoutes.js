// routes/customerRoutes.js
// Khai báo các route liên quan đến khách hàng

const express = require("express");
const router = express.Router();
const {
    registerCustomer,
    loginCustomer,
    refreshToken,
    getProfile,
    updateProfile,
} = require("../controllers/customerController");
const { protect } = require("../middlewares/authMiddleware");
const { validateRegister, validateLogin } = require("../middlewares/validateMiddleware");

// Upload ảnh avatar (Cloudinary)
const upload = require("../config/cloudinary");

// --- Xác thực (Authentication) ---
// POST /customer/register - Đăng ký
router.post("/register", validateRegister, registerCustomer);

// POST /customer/login - Đăng nhập
router.post("/login", validateLogin, loginCustomer);

// PUT /customer/refresh - Làm mới Access Token
router.put("/refresh", refreshToken);

// --- Hồ sơ (Profile) - yêu cầu đăng nhập ---
// GET /customer/profiles - Lấy thông tin hồ sơ
router.get("/profiles", protect, getProfile);

// PUT /customer/profiles - Cập nhật hồ sơ (hỗ trợ upload avatar)
router.put(
    "/profiles",
    protect,
    upload.single("avatar"), // Tên field upload trong form
    updateProfile
);

module.exports = router;

