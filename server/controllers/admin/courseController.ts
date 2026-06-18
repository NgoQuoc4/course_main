import { Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as courseService from "../../services/admin/courseService.js";

/**
 * @desc    Tạo khóa học mới (Admin)
 * @route   POST /courses
 */
export const createCourse = catchAsync(async (req: any, res: Response) => {
    // Tự động gán người tạo làm instructor nếu chưa có
    if (!req.body.instructor) {
        req.body.instructor = req.customer?._id || req.user?._id;
    }
    const course = await courseService.createCourse(req.body);

    res.status(201).json({
        success: true,
        message: "Tạo khóa học thành công.",
        data: course,
    });
});

/**
 * @desc    Cập nhật khóa học (Admin)
 * @route   PATCH /courses/:id
 */
export const updateCourse = catchAsync(async (req: any, res: Response) => {
    const course = await courseService.updateCourse(req.params.id as string, req.body);

    res.status(200).json({
        success: true,
        message: "Cập nhật khóa học thành công.",
        data: course,
    });
});

/**
 * @desc    Xóa khóa học (Admin)
 * @route   DELETE /courses/:id
 */
export const deleteCourse = catchAsync(async (req: any, res: Response) => {
    await courseService.deleteCourse(req.params.id as string);

    res.status(200).json({
        success: true,
        message: "Xóa khóa học thành công.",
    });
});
