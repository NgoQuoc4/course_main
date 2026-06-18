import prisma from "../../config/prisma.js";
import { createNotification } from "../admin/notificationService.js";

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

    const courseIds = courseList.map((item) => item.course).filter(id => id);

    // Kiểm tra đã mua chưa
    const existingOrders = await prisma.order.findMany({
        where: {
            customerId,
            status: { in: ["pending", "completed"] },
            courses: {
                some: {
                    courseId: { in: courseIds }
                }
            }
        }
    });

    if (existingOrders.length > 0) {
        throw { message: "Bạn đã đăng ký một hoặc nhiều khóa học trong đơn hàng này rồi.", statusCode: 400 };
    }

    const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } }
    });

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
        courseId: course.id,
        price: (course.salePrice && course.salePrice > 0 ? course.salePrice : course.price) || 0,
    }));

    const totalAmount = orderCourses.reduce((sum, item) => sum + item.price, 0);

    const [order] = await prisma.$transaction([
        prisma.order.create({
            data: {
                customerId,
                paymentMethod,
                totalAmount,
                status: "completed",
                note: note || "",
                name: name || "",
                phone: phone || "",
                email: email || "",
                type: type || "",
                courses: orderCourses,
            }
        }),
        prisma.course.updateMany({
            where: { id: { in: courseIds } },
            data: { enrollCount: { increment: 1 } }
        })
    ]);

    // Tạo thông báo cho Admin
    try {
        await createNotification({
            title: "Đăng ký khóa học mới",
            message: `Học viên ${name || email} vừa đăng ký khóa học thành công. Tổng cộng: ${totalAmount.toLocaleString("vi-VN")} vnđ.`,
            type: "order",
            referenceId: order.id,
        });
    } catch (err) {
        console.error("Lỗi tạo thông báo:", err);
    }

    return {
        ...order,
        _id: order.id,
    };
};

/**
 * Lấy lịch sử thanh toán
 */
export const getPaymentHistories = async (customerId: string) => {
    const orders = await prisma.order.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" }
    });

    const courseIds = orders.flatMap(o => o.courses.map(c => c.courseId));
    const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } }
    });
    const courseMap = new Map(courses.map(c => [c.id, c]));

    return orders.map(o => ({
        ...o,
        _id: o.id,
        courses: o.courses.map(oc => {
            const matched = courseMap.get(oc.courseId);
            return {
                price: oc.price,
                course: matched ? { ...matched, _id: matched.id } : null
            };
        })
    }));
};

/**
 * Lấy danh sách khóa học đã mua
 */
export const getCourseHistories = async (customerId: string) => {
    const orders = await prisma.order.findMany({
        where: { customerId, status: "completed" },
        orderBy: { createdAt: "desc" }
    });

    const courseIds = orders.flatMap(o => o.courses.map(c => c.courseId));
    const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } }
    });
    const courseMap = new Map(courses.map(c => [c.id, c]));

    return orders.map(o => ({
        ...o,
        _id: o.id,
        courses: o.courses.map(oc => {
            const matched = courseMap.get(oc.courseId);
            return {
                price: oc.price,
                course: matched ? { ...matched, _id: matched.id } : null
            };
        })
    }));
};
