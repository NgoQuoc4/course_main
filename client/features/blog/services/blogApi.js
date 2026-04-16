// features/blog/services/blogApi.js
// API calls riêng cho feature Blog

import { blogsService } from "@/services/blogsService";

export const getBlogsApi = (query) => blogsService.getBlogs(query);
export const getBlogBySlugApi = (slug) => blogsService.getBlogBySlug(slug);
export const getBlogCategoriesApi = () => blogsService.getBlogCategories();
