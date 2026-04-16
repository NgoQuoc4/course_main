import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "@/constants/environments";
import tokenMethod from "@/utils/token";

const axiosClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const tokenData = tokenMethod.get();
        if (tokenData?.accessToken) {
            config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

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
                tokenMethod.remove();
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
