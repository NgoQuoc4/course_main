import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as courseService from "../../services/storefront/courseService.js";

/**
 * @desc    Lấy danh sách khóa học
 * @route   GET /courses
 * @access  Public
 */
export const getCourses = catchAsync(async (req: Request, res: Response) => {
    const coursesData = await courseService.getCourses(req.query);

    res.status(200).json({
        success: true,
        data: coursesData,
    });
});

/**
 * @desc    Lấy chi tiết khóa học theo slug
 * @route   GET /courses/:slug
 * @access  Public
 */
export const getCourseBySlug = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const course = await courseService.getCourseBySlug(slug as string);

    res.status(200).json({
        success: true,
        data: course,
    });
});
