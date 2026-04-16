import axiosClient from "@/services/axiosClient";

export const teamServices = {
  getTeam(query = "") {
    return axiosClient.get(`/teams${query}`);
  },
};

