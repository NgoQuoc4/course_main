import axiosClient from "../axiosClient";

export const notificationService = {
  // Lấy danh sách thông báo
  getNotifications() {
    return axiosClient.get("/admin/notifications");
  },
  // Đánh dấu thông báo đã đọc
  markRead(id) {
    return axiosClient.put(`/admin/notifications/${id}/read`);
  },
  // Đánh dấu tất cả là đã đọc
  markAllRead() {
    return axiosClient.put("/admin/notifications/read-all");
  },
  // Xóa sạch tất cả thông báo
  clearAll() {
    return axiosClient.delete("/admin/notifications");
  },
};
