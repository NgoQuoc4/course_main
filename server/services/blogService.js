// src/services/blogService.js
// Tầng Business Logic cho Blog

const Blog = require("../models/Blog");
const BlogCategory = require("../models/BlogCategory");

/**
 * Lấy danh sách bài viết blog
 */
const getBlogs = async ({ category, search, page = 1, limit = 9, sort = "-createdAt" }) => {
    const filter = { status: "published" };

    // Lọc theo danh mục (tìm theo slug)
    if (category) {
        const blogCategory = await BlogCategory.findOne({ slug: category });
        if (blogCategory) {
            filter.category = blogCategory._id;
        }
    }

    // Tìm kiếm theo tiêu đề
    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
        .select("-content")
        .populate("category", "name slug")
        .populate("author", "firstName lastName avatar")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

    return {
        blogs,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

/**
 * Lấy chi tiết bài viết theo slug + tăng lượt xem
 */
const getBlogBySlug = async (slug) => {
    const blog = await Blog.findOne({ slug, status: "published" })
        .populate("category", "name slug")
        .populate("author", "firstName lastName avatar");

    if (!blog) {
        const error = new Error("Không tìm thấy bài viết.");
        error.statusCode = 404;
        throw error;
    }

    // Tăng lượt xem
    await Blog.findByIdAndUpdate(blog._id, { $inc: { viewCount: 1 } });

    return blog;
};

/**
 * Lấy danh sách danh mục blog
 */
const getBlogCategories = async () => {
    return BlogCategory.find({ isActive: true }).sort("name");
};

/**
 * Lấy danh mục blog theo slug
 */
const getBlogCategoryBySlug = async (slug) => {
    const category = await BlogCategory.findOne({ slug, isActive: true });
    if (!category) {
        const error = new Error("Không tìm thấy danh mục.");
        error.statusCode = 404;
        throw error;
    }
    return category;
};

/**
 * Tạo bài viết mới (Admin Only)
 */
const createBlog = async (blogData) => {
    return await Blog.create(blogData);
};

/**
 * Cập nhật bài viết (Admin Only)
 */
const updateBlog = async (id, updateData) => {
    const blog = await Blog.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!blog) {
        const error = new Error("Không tìm thấy bài viết để cập nhật.");
        error.statusCode = 404;
        throw error;
    }

    return blog;
};

/**
 * Xóa bài viết (Admin Only)
 */
const deleteBlog = async (id) => {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
        const error = new Error("Không tìm thấy bài viết để xóa.");
        error.statusCode = 404;
        throw error;
    }

    return blog;
};

module.exports = {
    getBlogs,
    getBlogBySlug,
    getBlogCategories,
    getBlogCategoryBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
};

