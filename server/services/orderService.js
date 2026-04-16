// src/services/orderService.js
// Tầng Business Logic cho Orders (Đơn hàng)

const Order = require("../models/Order");
const Course = require("../models/Course");
const { AppError } = require("../middlewares/errorHandler");

/**
 * Tạo đơn hàng mua khóa học
 */
const createOrder = async (customerId, payload) => {
    const { 
        courses: courseList = [], 
        paymentMethod = "banking", 
        note,
        name,
        phone,
        email,
        type
    } = payload;

    if (!courseList.length) {
        throw new AppError("Danh sách khóa học không được để trống.", 400);
    }

    // Kiểm tra đã mua chưa
    const existingOrders = await Order.find({
        customer: customerId,
        status: { $in: ["pending", "completed"] },
        "courses.course": {
            $in: courseList.map((item) => item.course).filter(id => id),
        },
    });

    if (existingOrders.length > 0) {
        throw new AppError("Bạn đã đăng ký một hoặc nhiều khóa học trong đơn hàng này rồi.", 400);
    }

    // Lấy thông tin và giá từ DB
    const courseIds = courseList.map((item) => item.course).filter(id => id);
    if (!courseIds.length) {
        throw new AppError("Dữ liệu khóa học không hợp lệ.", 400);
    }

    const courses = await Course.find({ _id: { $in: courseIds } });

    if (!courses || courses.length === 0) {
        throw new AppError("Không tìm thấy các khóa học tương ứng.", 404);
    }

    // Tính tổng tiền
    const orderCourses = courses.map((course) => ({
        course: course._id,
        price: (course.salePrice > 0 ? course.salePrice : course.price) || 0,
    }));

    const totalAmount = orderCourses.reduce((sum, item) => sum + item.price, 0);

    // Tạo đơn hàng - Mặc định là completed để học viên thấy khóa học ngay
    const order = await Order.create({
        customer: customerId,
        courses: orderCourses,
        totalAmount,
        paymentMethod,
        note: note || "",
        status: "completed",
        name,
        phone,
        email,
        type,
    });

    // Cập nhật số lượng đăng ký
    await Course.updateMany(
        { _id: { $in: courseIds } },
        { $inc: { enrollCount: 1 } }
    );

    return order;
};

/**
 * Lấy lịch sử thanh toán
 */
const getPaymentHistories = async (customerId) => {
    return Order.find({ customer: customerId })
        .populate({
            path: "courses.course",
            select: "title thumbnail slug price salePrice",
        })
        .sort("-createdAt");
};

/**
 * Lấy danh sách khóa học đã mua
 */
const getCourseHistories = async (customerId) => {
    return Order.find({
        customer: customerId,
        status: "completed",
    })
        .populate({
            path: "courses.course",
            select: "title thumbnail slug chapters enrollCount rating level",
        })
        .sort("-createdAt");
};

module.exports = { createOrder, getPaymentHistories, getCourseHistories };

