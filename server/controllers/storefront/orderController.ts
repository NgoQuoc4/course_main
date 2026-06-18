import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as orderService from "../../services/storefront/orderService.js";

/**
 * @desc    Tạo đơn hàng mua khóa học
 * @route   POST /orders
 * @access  Private (Cần JWT)
 */
export const createOrder = catchAsync(async (req: Request, res: Response) => {
    if (!req.customer) {
        throw { message: "Bạn chưa đăng nhập.", statusCode: 401 };
    }
    
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
export const getMyPaymentHistories = catchAsync(async (req: Request, res: Response) => {
    if (!req.customer) {
        throw { message: "Bạn chưa đăng nhập.", statusCode: 401 };
    }

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
export const getMyCourseHistories = catchAsync(async (req: Request, res: Response) => {
    if (!req.customer) {
        throw { message: "Bạn chưa đăng nhập.", statusCode: 401 };
    }

    const orders = await orderService.getCourseHistories(req.customer._id);

    res.status(200).json({
        success: true,
        data: { orders },
    });
});
