import { Router } from "express";
import {
    createOrder,
    getMyPaymentHistories,
    getMyCourseHistories,
} from "../controllers/storefront/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateOrder } from "../middlewares/validateMiddleware.js";

const router = Router();

// Tất cả các route đơn hàng đều yêu cầu đăng nhập
router.use(protect);

// GET /orders/courses/me - Lịch sử khóa học đã mua
router.get("/courses/me", getMyCourseHistories);

// GET /orders/me - Lịch sử thanh toán
router.get("/me", getMyPaymentHistories);

// POST /orders - Tạo đơn hàng mới
router.post("/", validateOrder, createOrder);

export default router;
