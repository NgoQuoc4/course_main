import axiosClient from "@/services/axiosClient";

export const subscribesService = {
  getSubsriber(payload = {}) {
    return axiosClient.post(`/subscribes`, payload);
  },
};

