import axiosClient from "@/services/axiosClient";

export const questionService = {
  getQuestion(query = "") {
    return axiosClient.get(`/questions${query}`);
  },
};