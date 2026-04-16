import axiosClient from "@/services/axiosClient";

export const galleryServices = {
  getGallery(query = "") {
    return axiosClient.get(`/galleries${query}`);
  },
};

