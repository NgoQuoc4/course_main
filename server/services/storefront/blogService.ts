import prisma from "../../config/prisma.js";

interface GetBlogsQuery {
    category?: string;
    search?: string;
    page?: number | string;
    limit?: number | string;
    sort?: string;
    status?: string;
}

/**
 * Lấy danh sách bài viết blog
 */
export const getBlogs = async ({ category, search, status, page = 1, limit = 9, sort = "-createdAt" }: GetBlogsQuery) => {
    const where: any = {};

    if (status) {
        if (status === "all") {
            // No status filter
        } else if (status.includes(",")) {
            where.status = { in: status.split(",") };
        } else {
            where.status = status;
        }
    } else {
        where.status = "published";
    }

    if (category) {
        const blogCategory = await prisma.blogCategory.findUnique({
            where: { slug: category }
        });
        if (blogCategory) {
            where.categoryId = blogCategory.id;
        }
    }

    if (search) {
        where.title = { contains: search, mode: "insensitive" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort) {
        const field = sort.startsWith("-") ? sort.substring(1) : sort;
        const direction = sort.startsWith("-") ? "desc" : "asc";
        orderBy = { [field]: direction };
    }

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
            where,
            orderBy,
            skip,
            take,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                },
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                }
            }
        }),
        prisma.blog.count({ where })
    ]);

    const mappedBlogs = blogs.map(blog => ({
        ...blog,
        _id: blog.id,
        category: blog.category ? { ...blog.category, _id: blog.category.id } : null,
        author: blog.author ? { ...blog.author, _id: blog.author.id } : null,
    }));

    return {
        blogs: mappedBlogs,
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
    const blog = await prisma.blog.findUnique({
        where: { slug },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            },
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                }
            }
        }
    });

    if (!blog || blog.status !== "published") {
        throw { message: "Không tìm thấy bài viết.", statusCode: 404 };
    }

    // Tăng lượt xem
    await prisma.blog.update({
        where: { id: blog.id },
        data: { viewCount: { increment: 1 } },
    });

    return {
        ...blog,
        _id: blog.id,
        category: blog.category ? { ...blog.category, _id: blog.category.id } : null,
        author: blog.author ? { ...blog.author, _id: blog.author.id } : null,
    };
};

/**
 * Lấy danh sách danh mục blog
 */
export const getBlogCategories = async () => {
    const categories = await prisma.blogCategory.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" }
    });
    return categories.map(c => ({ ...c, _id: c.id }));
};

/**
 * Lấy danh mục blog theo slug
 */
export const getBlogCategoryBySlug = async (slug: string) => {
    const category = await prisma.blogCategory.findFirst({
        where: { slug, isActive: true }
    });
    if (!category) {
        throw { message: "Không tìm thấy danh mục.", statusCode: 404 };
    }
    return { ...category, _id: category.id };
};
