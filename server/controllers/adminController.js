const catchAsync = require("../utils/catchAsync");
const Course = require("../models/Course");
const Blog = require("../models/Blog");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Subscribe = require("../models/Subscribe");
const Role = require("../models/Role");

/**
 * @desc    Lấy toàn bộ thống kê cho Dashboard Admin
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
const getAdminStats = catchAsync(async (req, res) => {
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

const customerService = require("../services/customerService");

/**
 * @desc    Lấy danh sách người dùng
 * @route   GET /api/admin/users
 */
const getUsers = catchAsync(async (req, res) => {
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
const updateUserRole = catchAsync(async (req, res) => {
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
const deleteUser = catchAsync(async (req, res) => {
    await customerService.deleteUser(req.params.id);
    res.status(200).json({
        success: true,
        message: "Xóa người dùng thành công.",
    });
});

module.exports = { getAdminStats, getUsers, updateUserRole, deleteUser };
