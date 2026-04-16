import Blog from "../models/Blog.js";
import BlogCategory from "../models/BlogCategory.js";

interface GetBlogsQuery {
    category?: string;
    search?: string;
    page?: number | string;
    limit?: number | string;
    sort?: string;
}

/**
 * Lấy danh sách bài viết blog
 */
export const getBlogs = async ({ category, search, status, page = 1, limit = 9, sort = "-createdAt" }: GetBlogsQuery) => {
    const filter: any = {};

    if (status) {
        if (status === "all") {
            // No status filter
        } else if (status.includes(",")) {
            filter.status = { $in: status.split(",") };
        } else {
            filter.status = status;
        }
    } else {
        filter.status = "published";
    }

    if (category) {
        const blogCategory = await BlogCategory.findOne({ slug: category });
        if (blogCategory) {
            filter.category = blogCategory._id;
        }
    }

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
export const getBlogBySlug = async (slug: string) => {
    const blog = await Blog.findOne({ slug, status: "published" })
        .populate("category", "name slug")
        .populate("author", "firstName lastName avatar");

    if (!blog) {
        throw { message: "Không tìm thấy bài viết.", statusCode: 404 };
    }

    // Tăng lượt xem
    await Blog.findByIdAndUpdate(blog._id, { $inc: { viewCount: 1 } });

    return blog;
};

/**
 * Lấy danh sách danh mục blog
 */
export const getBlogCategories = async () => {
    return BlogCategory.find({ isActive: true }).sort("name");
};

/**
 * Lấy danh mục blog theo slug
 */
export const getBlogCategoryBySlug = async (slug: string) => {
    const category = await BlogCategory.findOne({ slug, isActive: true });
    if (!category) {
        throw { message: "Không tìm thấy danh mục.", statusCode: 404 };
    }
    return category;
};

/**
 * Tạo bài viết mới (Admin Only)
 */
export const createBlog = async (blogData: any) => {
    return await Blog.create(blogData);
};

/**
 * Cập nhật bài viết (Admin Only)
 */
export const updateBlog = async (id: string, updateData: any) => {
    const blog = await Blog.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!blog) {
        throw { message: "Không tìm thấy bài viết để cập nhật.", statusCode: 404 };
    }

    return blog;
};

/**
 * Xóa bài viết (Admin Only)
 */
export const deleteBlog = async (id: string) => {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
        throw { message: "Không tìm thấy bài viết để xóa.", statusCode: 404 };
    }

    return blog;
};
