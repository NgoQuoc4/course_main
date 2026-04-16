import axiosClient from "@/services/axiosClient";

export const subscribesService = {
  getSubsriber(payload: any = {}) {
    return axiosClient.post(`/subscribes`, payload);
  },
};
