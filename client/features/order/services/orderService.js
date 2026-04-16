import axiosClient from "@/services/axiosClient";

export const orderService = {
  getPaymentHistories() {
    return axiosClient.get(`/orders/me`);
  },
  getCourseHistories() {
    return axiosClient.get(`/orders/courses/me`);
  },
  orderCourse(payload = {}) {
    return axiosClient.post(`/orders`, payload);
  },
};