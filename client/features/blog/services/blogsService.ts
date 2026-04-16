import axiosClient from "@/services/axiosClient";

export const blogsService = {
  getBlog(query: string = "") {
    return axiosClient.get(`/blogs${query}`);
  },
  getBlogBySlug(slug: string = "") {
    return axiosClient.get(`/blogs/${slug}`);
  },
  getBlogCategories(query: string = "") {
    return axiosClient.get(`/blog-categories${query}`);
  },
};
