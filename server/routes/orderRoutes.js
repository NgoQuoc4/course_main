// routes/orderRoutes.js
// Khai báo các route liên quan đến đơn hàng

const express = require("express");
const router = express.Router();
const {
    createOrder,
    getMyPaymentHistories,
    getMyCourseHistories,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const { validateOrder } = require("../middlewares/validateMiddleware");

// Tất cả các route đơn hàng đều yêu cầu đăng nhập
router.use(protect);

// GET /orders/me - Lịch sử thanh toán
// Quan trọng: đặt route /courses/me TRƯỚC /:id để tránh conflict
router.get("/courses/me", getMyCourseHistories);

// GET /orders/me - Lịch sử đơn hàng
router.get("/me", getMyPaymentHistories);

// POST /orders - Tạo đơn hàng mới
router.post("/", validateOrder, createOrder);

module.exports = router;

