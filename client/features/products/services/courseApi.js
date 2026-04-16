// features/products/services/courseApi.js
// API calls riêng cho feature Products/Courses

import { courseServices } from "@/services/courseServices";

export const getCoursesApi = (query) => courseServices.getCourses(query);
export const getCourseBySlugApi = (slug) => courseServices.getCourseBySlug(slug);
