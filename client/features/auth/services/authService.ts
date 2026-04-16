import axiosClient from "@/services/axiosClient";

export const authService = {
  login(payload: any = {}) {
    return axiosClient.post(`/customer/login`, payload);
  },
  register(payload: any = {}) {
    return axiosClient.post(`/customer/register`, payload);
  },
  getProfiles() {
    return axiosClient.get(`/customer/profiles`);
  },
  updateProfile(payload: any = {}) {
    return axiosClient.put(`/customer/profiles`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
