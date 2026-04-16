import axiosClient from "../axiosClient";

export const adminStatsService = {
    // Lấy thống kê tổng quan
    getStats() {
        return axiosClient.get("/admin/stats");
    }
};
