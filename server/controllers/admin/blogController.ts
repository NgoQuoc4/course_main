import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as blogService from "../../services/admin/blogService.js";

/**
 * @desc    Tạo bài viết mới (Admin)
 */
export const createBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.createBlog(req.body);

    res.status(201).json({
        success: true,
        message: "Tạo bài viết thành công.",
        data: blog,
    });
});

/**
 * @desc    Cập nhật bài viết (Admin)
 */
export const updateBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.updateBlog(req.params.id as string, req.body);

    res.status(200).json({
        success: true,
        message: "Cập nhật bài viết thành công.",
        data: blog,
    });
});

/**
 * @desc    Xóa bài viết (Admin)
 */
export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    await blogService.deleteBlog(req.params.id as string);

    res.status(200).json({
        success: true,
        message: "Xóa bài viết thành công.",
    });
});
