import axiosClient from "../axiosClient";

export const adminBlogServices = {
    // Lấy danh sách bài viết
    getBlogs(query = "") {
        return axiosClient.get(`/blogs${query}`);
    },
    // Tạo bài viết mới
    createBlog(data) {
        return axiosClient.post("/blogs", data);
    },
    // Cập nhật bài viết
    updateBlog(id, data) {
        return axiosClient.patch(`/blogs/${id}`, data);
    },
    // Xóa bài viết
    deleteBlog(id) {
        return axiosClient.delete(`/blogs/${id}`);
    },
    // Lấy danh mục blog
    getCategories() {
        return axiosClient.get("/blog-categories");
    }
};
