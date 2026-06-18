import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as customerService from "../../services/admin/customerService.js";
import prisma from "../../config/prisma.js";

/**
 * @desc    Lấy toàn bộ thống kê cho Dashboard Admin
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
export const getAdminStats = catchAsync(async (req: Request, res: Response) => {
  // 1. Phải lấy Role ID cho 'customer' vì hiện tại role là ObjectID
  const customerRole = await prisma.role.findFirst({
    where: { slug: "USER" },
  });

  // 2. Đếm tổng số lượng bằng Prisma
  const [
    totalCourses,
    totalBlogs,
    totalCustomers,
    totalSubscribes,
    totalOrders,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.blog.count(),
    prisma.user.count({
      where: {
        roleId: customerRole?.id,
      },
    }),
    prisma.subscribe.count(),
    prisma.order.count(),
  ]);

  // 2. Thống kê doanh thu (Tổng totalAmount của đơn hàng completed)
  const revenueData = await prisma.order.aggregate({
    where: {
      status: "completed",
    },
    _sum: {
      totalAmount: true,
    },
  });
  const totalRevenue = revenueData._sum.totalAmount || 0;

  // 3. Lấy các hoạt động gần đây (5 đơn hàng mới nhất)
  const recentOrders = await prisma.order.findMany({
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // 4. Lấy các khóa học phổ biến (theo enrollCount)
  const popularCourses = await prisma.course.findMany({
    where: {
      status: "active",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      thumbnail: true,
      enrollCount: true,
    },
    orderBy: {
      enrollCount: "desc",
    },
    take: 5,
  });

  res.status(200).json({
    success: true,
    data: {
      counts: {
        courses: totalCourses,
        blogs: totalBlogs,
        customers: totalCustomers,
        subscribes: totalSubscribes,
        orders: totalOrders,
      },
      totalRevenue,
      recentOrders,
      popularCourses,
    },
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
export const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const { role } = req.body;
    const user = await customerService.updateUserRole(
      req.params.id as string,
      role,
    );
    res.status(200).json({
      success: true,
      message: "Cập nhật vai trò thành công.",
      data: user,
    });
  },
);

/**
 * @desc    Xóa người dùng
 * @route   DELETE /api/admin/users/:id
 */
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.customer?.id;
  const { id } = req.params;

  if (userId === id) {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền xóa chính mình.",
    });
  }

  await customerService.deleteUser(id as string);
  res.status(200).json({
    success: true,
    message: "Xóa người dùng thành công.",
  });
});
