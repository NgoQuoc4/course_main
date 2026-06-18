import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "@/constants/environments";
import tokenMethod from "@/utils/token";

const axiosClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = tokenMethod.get();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            originalRequest.url !== "/customer/refresh" &&
            originalRequest.url !== "/customer/login" &&
            originalRequest.url !== "/customer/register" &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                axiosClient
                    .put("/customer/refresh")
                    .then((res) => {
                        const accessToken = res.data.data?.token;
                        tokenMethod.set(accessToken);
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        processQueue(null, accessToken);
                        resolve(axiosClient(originalRequest));
                    })
                    .catch((refreshError) => {
                        processQueue(refreshError, null);
                        tokenMethod.remove();
                        window.location.href = "/";
                        reject(refreshError);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
