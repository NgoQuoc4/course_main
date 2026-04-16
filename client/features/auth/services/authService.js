import axiosClient from "@/services/axiosClient";

export const authService = {
  login(payload = {}) {
    return axiosClient.post(`/customer/login`, payload);
  },
  register(payload = {}) {
    return axiosClient.post(`/customer/register`, payload);
  },
  getProfiles() {
    return axiosClient.get(`/customer/profiles`);
  },
  updateProfile(payload = {}) {
    return axiosClient.put(`/customer/profiles`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

