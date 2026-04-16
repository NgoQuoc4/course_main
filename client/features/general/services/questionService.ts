import axiosClient from "@/services/axiosClient";

export const questionService = {
  getQuestion(query: string = "") {
    return axiosClient.get(`/questions${query}`);
  },
};
