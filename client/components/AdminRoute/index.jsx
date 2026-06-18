import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import PATHS from '@/constants/paths';
import tokenMethod from '@/utils/token';
import { MODAL_TYPES } from '@/constants/general';
import NoPermissionPage from '@/pages/AdminPage/NoPermissionPage';
import PageLoading from '@/components/PageLoading';

/**
 * Component bảo vệ các route Admin
 * @param {Array} allowedRoles - Danh sách role slug được phép truy cập
 */
const AdminRoute = ({ allowedRoles = ['admin', 'teacher'] }) => {
    const { profile, handleShowModal } = useAuthContext();
    const token = tokenMethod.get();

    // 1. Chưa đăng nhập
    if (!token) {
        handleShowModal?.(MODAL_TYPES.login);
        return <Navigate to={PATHS.HOME} />;
    }

    // 2. Đã đăng nhập nhưng chưa có thông tin profile (đang load)
    if (!profile) return <PageLoading fixed={true} />;

    const userRole = (profile.role?.slug || profile.role || '').toLowerCase();

    // 3. Nếu là 'customer' hoặc 'user' -> Chuyển về trang chủ theo yêu cầu của user
    if (userRole === 'customer' || userRole === 'user') {
        return <Navigate to={PATHS.HOME} />;
    }

    // 4. Nếu là role không được phép -> Hiện trang No Permission
    const lowerAllowedRoles = allowedRoles.map(role => role.toLowerCase());
    if (!lowerAllowedRoles.includes(userRole)) {
        return <NoPermissionPage />;
    }

    // 5. Nếu hợp lệ -> Cho qua
    return <Outlet />;
};

export default AdminRoute;
