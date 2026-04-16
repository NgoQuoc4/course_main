import axiosClient from "@/services/axiosClient";

export const teamServices = {
  getTeam(query: string = "") {
    return axiosClient.get(`/teams${query}`);
  },
};
