import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import Course from "../models/Course.js";
import Blog from "../models/Blog.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Subscribe from "../models/Subscribe.js";
import Role from "../models/Role.js";
import * as customerService from "../services/customerService.js";

/**
 * @desc    Lấy toàn bộ thống kê cho Dashboard Admin
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
export const getAdminStats = catchAsync(async (req: Request, res: Response) => {
    // 1. Phải lấy Role ID cho 'customer' vì hiện tại role là ObjectID
    const customerRole = await Role.findOne({ slug: "customer" });

    // 2. Đếm tổng số lượng
    const [
        totalCourses,
        totalBlogs,
        totalCustomers,
        totalSubscribes,
        totalOrders
    ] = await Promise.all([
        Course.countDocuments(),
        Blog.countDocuments(),
        Customer.countDocuments({ role: customerRole?._id }),
        Subscribe.countDocuments(),
        Order.countDocuments()
    ]);

    // 2. Thống kê doanh thu (Tổng totalAmount của đơn hàng completed)
    const revenueData = await Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 3. Lấy các hoạt động gần đây (5 đơn hàng mới nhất)
    const recentOrders = await Order.find()
        .populate("customer", "firstName lastName avatar")
        .sort("-createdAt")
        .limit(5);

    // 4. Lấy các khóa học phổ biến (theo enrollCount)
    const popularCourses = await Course.find()
        .select("title slug enrollCount price thumbnail")
        .sort("-enrollCount")
        .limit(5);

    res.status(200).json({
        success: true,
        data: {
            counts: {
                courses: totalCourses,
                blogs: totalBlogs,
                customers: totalCustomers,
                subscribes: totalSubscribes,
                orders: totalOrders
            },
            totalRevenue,
            recentOrders,
            popularCourses
        }
    });
});

/**
 * @desc    Lấy danh sách người dùng
 * @route   GET /api/admin/users
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const data = await customerService.getUsers(req.query);
    res.status(200).json({
        success: true,
        data,
    });
});

/**
 * @desc    Cập nhật vai trò người dùng
 * @route   PATCH /api/admin/users/:id/role
 */
export const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const { role } = req.body;
    const user = await customerService.updateUserRole(req.params.id, role);
    res.status(200).json({
        success: true,
        message: "Cập nhật vai trò thành công.",
        data: user,
    });
});

/**
 * @desc    Xóa người dùng
 * @route   DELETE /api/admin/users/:id
 */
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    await customerService.deleteUser(req.params.id);
    res.status(200).json({
        success: true,
        message: "Xóa người dùng thành công.",
    });
});
