import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as notificationService from "../../services/admin/notificationService.js";

/**
  * @desc    Lấy danh sách thông báo
  * @route   GET /api/admin/notifications
  */
export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await notificationService.getNotifications();
  res.status(200).json({
    success: true,
    data: notifications,
  });
});

/**
  * @desc    Đánh dấu thông báo đã đọc
  * @route   PUT /api/admin/notifications/:id/read
  */
export const markRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await notificationService.markAsRead(id as string);
  res.status(200).json({
    success: true,
    data: notification,
  });
});

/**
  * @desc    Đánh dấu tất cả thông báo là đã đọc
  * @route   PUT /api/admin/notifications/read-all
  */
export const markAllRead = catchAsync(async (req: Request, res: Response) => {
  await notificationService.markAllAsRead();
  res.status(200).json({
    success: true,
    message: "Đã đánh dấu tất cả thông báo là đã đọc.",
  });
});

/**
  * @desc    Xóa sạch tất cả thông báo
  * @route   DELETE /api/admin/notifications
  */
export const clearAll = catchAsync(async (req: Request, res: Response) => {
  await notificationService.clearAllNotifications();
  res.status(200).json({
    success: true,
    message: "Đã xóa sạch tất cả thông báo.",
  });
});
