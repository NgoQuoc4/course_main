// features/auth/services/authApi.js
// API calls riêng cho feature Authentication
// ======================================================================
// File này wrap lại authService từ tầng services/ chung,
// hoặc bổ sung thêm các API đặc thù chỉ dùng trong feature auth.
// ======================================================================

import { authService } from "@/services/authService";

/**
 * Đăng nhập
 * @param {{ email: string, password: string }} payload
 */
export const loginApi = (payload) => authService.login(payload);

/**
 * Đăng ký tài khoản mới
 * @param {{ firstName: string, lastName: string, email: string, password: string }} payload
 */
export const registerApi = (payload) => authService.register(payload);

/**
 * Lấy thông tin profile người dùng hiện tại
 */
export const getProfileApi = () => authService.getProfiles();

/**
 * Cập nhật thông tin profile
 * @param {FormData} payload
 */
export const updateProfileApi = (payload) => authService.updateProfile(payload);
