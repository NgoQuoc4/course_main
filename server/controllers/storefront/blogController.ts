import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as blogService from "../../services/storefront/blogService.js";

/**
 * @desc    Lấy danh sách bài viết blog
 * @route   GET /blogs
 * @access  Public
 */
export const getBlogs = catchAsync(async (req: Request, res: Response) => {
    const data = await blogService.getBlogs(req.query);

    res.status(200).json({
        success: true,
        data,
    });
});

/**
 * @desc    Lấy chi tiết bài viết theo slug
 * @route   GET /blogs/:slug
 * @access  Public
 */
export const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.getBlogBySlug(req.params.slug as string);

    res.status(200).json({
        success: true,
        data: blog,
    });
});

/**
 * @desc    Lấy danh sách danh mục blog
 * @route   GET /blog-categories
 * @access  Public
 */
export const getBlogCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await blogService.getBlogCategories();

    res.status(200).json({
        success: true,
        data: categories,
    });
});

/**
 * @desc    Lấy danh mục blog theo slug
 * @route   GET /blog-categories/:slug
 * @access  Public
 */
export const getBlogCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
    const category = await blogService.getBlogCategoryBySlug(req.params.slug as string);

    res.status(200).json({
        success: true,
        data: category,
    });
});
