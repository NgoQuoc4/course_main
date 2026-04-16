// controllers/orderController.js
// Controller xử lý Orders - LỚP MỎNG gọi Service

const catchAsync = require("../utils/catchAsync");
const orderService = require("../services/orderService");

/**
 * @desc    Tạo đơn hàng mua khóa học
 * @route   POST /orders
 * @access  Private (Cần JWT)
 */
const createOrder = catchAsync(async (req, res) => {
    const order = await orderService.createOrder(req.customer._id, req.body);

    res.status(201).json({
        success: true,
        message: "Tạo đơn hàng thành công.",
        data: order,
    });
});

/**
 * @desc    Lấy lịch sử thanh toán
 * @route   GET /orders/me
 * @access  Private (Cần JWT)
 */
const getMyPaymentHistories = catchAsync(async (req, res) => {
    const orders = await orderService.getPaymentHistories(req.customer._id);

    res.status(200).json({
        success: true,
        data: { orders },
    });
});

/**
 * @desc    Lấy danh sách khóa học đã mua
 * @route   GET /orders/courses/me
 * @access  Private (Cần JWT)
 */
const getMyCourseHistories = catchAsync(async (req, res) => {
    const orders = await orderService.getCourseHistories(req.customer._id);

    res.status(200).json({
        success: true,
        data: { orders },
    });
});

module.exports = { createOrder, getMyPaymentHistories, getMyCourseHistories };

