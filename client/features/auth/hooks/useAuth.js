// features/auth/hooks/useAuth.js
// Custom hook đóng gói logic Authentication
// ======================================================================
// Hook này giúp các Component trong feature Auth truy cập logic
// đăng nhập/đăng xuất mà không cần biết bên trong dùng Context hay Redux.
// ======================================================================

import { useAuthContext } from "@/context/AuthContext";

/**
 * Hook truy cập authentication state & actions
 * @returns {{
 *   profile: object,
 *   showedModal: string,
 *   courseInfo: array,
 *   paymentInfo: array,
 *   handleShowModal: function,
 *   handleCloseModal: function,
 *   handleLogin: function,
 *   handleRegister: function,
 *   handleLogout: function,
 *   handleUpdateProfile: function,
 * }}
 */
const useAuth = () => {
    const authContext = useAuthContext();
    return authContext;
};

export default useAuth;
