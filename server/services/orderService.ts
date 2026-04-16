import Order from "../models/Order.js";
import Course from "../models/Course.js";

interface CreateOrderPayload {
    courses: { course: string }[];
    paymentMethod?: string;
    note?: string;
    name?: string;
    phone?: string;
    email?: string;
    type?: string;
}

/**
 * Tạo đơn hàng mua khóa học
 */
export const createOrder = async (customerId: string, payload: CreateOrderPayload) => {
    const { 
        courses: courseList = [], 
        paymentMethod = "transfer", 
        note,
        name,
        phone,
        email,
        type
    } = payload;

    if (!courseList.length) {
        throw { message: "Danh sách khóa học không được để trống.", statusCode: 400 };
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
        throw { message: "Bạn đã đăng ký một hoặc nhiều khóa học trong đơn hàng này rồi.", statusCode: 400 };
    }

    const courseIds = courseList.map((item) => item.course).filter(id => id);
    const courses = await Course.find({ _id: { $in: courseIds } });

    if (!courses || courses.length === 0) {
        throw { message: "Không tìm thấy các khóa học tương ứng.", statusCode: 404 };
    }

    // Kiểm tra trạng thái khóa học
    const inactiveCourses = courses.filter(c => c.status !== "active");
    if (inactiveCourses.length > 0) {
        throw { 
            message: `Khóa học "${inactiveCourses[0].title}" hiện không mở đăng ký.`, 
            statusCode: 400 
        };
    }

    const orderCourses = courses.map((course) => ({
        course: course._id,
        price: (course.salePrice && course.salePrice > 0 ? course.salePrice : course.price) || 0,
    }));

    const totalAmount = orderCourses.reduce((sum, item) => sum + item.price, 0);

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

    await Course.updateMany(
        { _id: { $in: courseIds } },
        { $inc: { enrollCount: 1 } }
    );

    return order;
};

/**
 * Lấy lịch sử thanh toán
 */
export const getPaymentHistories = async (customerId: string) => {
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
export const getCourseHistories = async (customerId: string) => {
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
