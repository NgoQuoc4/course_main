import axiosClient from "@/services/axiosClient";

export const courseServices = {
  getCourses(query: string = "") {
    return axiosClient.get(`/courses${query}`);
  },
  getCourseBySlug(slug: string = "") {
    return axiosClient.get(`/courses/${slug}`);
  },
};
