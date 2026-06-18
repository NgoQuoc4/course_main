import prisma from "../../config/prisma.js";

/**
 * Tạo bài viết mới (Admin Only)
 */
export const createBlog = async (blogData: any) => {
    const { category, author, ...rest } = blogData;
    return await prisma.blog.create({
        data: {
            ...rest,
            categoryId: category,
            authorId: author,
        }
    });
};

/**
 * Cập nhật bài viết (Admin Only)
 */
export const updateBlog = async (id: string, updateData: any) => {
    const { category, author, ...rest } = updateData;
    const data: any = { ...rest };
    if (category) data.categoryId = category;
    if (author) data.authorId = author;

    return await prisma.blog.update({
        where: { id },
        data,
    });
};

/**
 * Xóa bài viết (Admin Only)
 */
export const deleteBlog = async (id: string) => {
    return await prisma.blog.delete({
        where: { id },
    });
};
