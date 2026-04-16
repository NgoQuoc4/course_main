import axiosClient from "@/services/axiosClient";

export const courseServices = {
  getCourses(query = "") {
    return axiosClient.get(`/courses${query}`);
  },
  getCourseBySlug(slug = "") {
    return axiosClient.get(`/courses/${slug}`);
  },
};



