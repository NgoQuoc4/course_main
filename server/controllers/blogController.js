// controllers/blogController.js
// Controller xử lý Blog - LỚP MỎNG gọi Service

const catchAsync = require("../utils/catchAsync");
const blogService = require("../services/blogService");

/**
 * @desc    Lấy danh sách bài viết blog
 * @route   GET /blogs
 * @access  Public
 */
const getBlogs = catchAsync(async (req, res) => {
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
const getBlogBySlug = catchAsync(async (req, res) => {
    const blog = await blogService.getBlogBySlug(req.params.slug);

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
const getBlogCategories = catchAsync(async (req, res) => {
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
const getBlogCategoryBySlug = catchAsync(async (req, res) => {
    const category = await blogService.getBlogCategoryBySlug(req.params.slug);

    res.status(200).json({
        success: true,
        data: category,
    });
});

/**
 * @desc    Tạo bài viết mới (Admin)
 */
const createBlog = catchAsync(async (req, res) => {
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
const updateBlog = catchAsync(async (req, res) => {
    const blog = await blogService.updateBlog(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "Cập nhật bài viết thành công.",
        data: blog,
    });
});

/**
 * @desc    Xóa bài viết (Admin)
 */
const deleteBlog = catchAsync(async (req, res) => {
    await blogService.deleteBlog(req.params.id);

    res.status(200).json({
        success: true,
        message: "Xóa bài viết thành công.",
    });
});

module.exports = {
    getBlogs,
    getBlogBySlug,
    getBlogCategories,
    getBlogCategoryBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
};

