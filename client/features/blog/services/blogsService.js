import axiosClient from "@/services/axiosClient";

export const blogsService = {
  getBlog(query = "") {
    return axiosClient.get(`/blogs${query}`);
  },
  getBlogBySlug(slug = "") {
    return axiosClient.get(`/blogs/${slug}`);
  },
  getBlogCategories(query = "") {
    return axiosClient.get(`/blog-categories${query}`);
  },
};