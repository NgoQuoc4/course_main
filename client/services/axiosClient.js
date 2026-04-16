// services/axiosClient.js
// Cấu hình Axios Client tập trung - Nơi duy nhất tạo instance Axios
// ======================================================================
// Anh tách riêng file này ra khỏi utils/ để đặt đúng vào services/
// vì nó thuộc về tầng giao tiếp API, không phải hàm tiện ích thuần.
// ======================================================================

import axios from "axios";
import { BASE_URL } from "@/constants/environments";
import tokenMethod from "@/utils/token";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 giây timeout
});

// ============================================================
// REQUEST Interceptor - Đính kèm Token trước mỗi request
// ============================================================
axiosClient.interceptors.request.use(
    (config) => {
        const tokenData = tokenMethod.get();
        if (tokenData?.accessToken) {
            config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE Interceptor - Tự động refresh token khi hết hạn
// ============================================================
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401/403 và KHÔNG PHẢI lỗi từ chính api/customer/refresh
        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            originalRequest.url !== "/customer/refresh" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const res = await axiosClient.put("/customer/refresh", {
                    refreshToken: tokenMethod.get()?.refreshToken,
                });
                const { token: accessToken, refreshToken } = res.data.data || {};

                tokenMethod.set({ accessToken, refreshToken });
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Refresh cũng thất bại -> xóa trắng token và đẩy về trang chủ
                tokenMethod.remove();
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
