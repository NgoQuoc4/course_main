import PATHS from "@/constants/paths";
import { authService } from "@/features/auth/services/authService";
import { orderService } from "@/features/order/services/orderService";
import tokenMethod from "@/utils/token";
import { message } from "antd";
import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useQuery from "@/hooks/useQuery";
import { IUser } from "../../types/user";
import { ICourse } from "../../types/course";
import { IOrder } from "../../types/order";

interface AuthContextValue {
    showedModal: string;
    profile: IUser | undefined;
    courseInfo: (ICourse & { orderId: string; orderStatus: string })[];
    paymentInfo: IOrder[];
    handleShowModal: (modalType: string) => void;
    handleCloseModal: (e?: React.MouseEvent | any) => void;
    handleLogin: (loginData: any, callback?: () => void) => Promise<void>;
    handleRegister: (registerData: any, callback: () => void) => Promise<void>;
    handleLogout: () => void | Promise<void>;
    handleGetProfileCourse: () => Promise<void>;
    handleGetProfilePayment: () => Promise<void>;
    handleUpdateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [showedModal, setShowedModal] = useState<string>("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const hasToken = !!tokenMethod.get();

    // Query Profile
    const { data: profileData, error: profileError, refetch: refetchProfile } = useQuery({
        queryKey: ["profile"],
        queryFn: () => authService.getProfiles(),
        enabled: hasToken,
    });

    const profile = profileData;

    // Query Course Info
    const { data: courseInfoRaw, refetch: refetchCourseInfo } = useQuery({
        queryKey: ["profile-courses"],
        queryFn: () => orderService.getCourseHistories(),
        enabled: hasToken,
    });

    // Query Payment Info
    const { data: paymentInfoRaw, refetch: refetchPaymentInfo } = useQuery({
        queryKey: ["profile-payments"],
        queryFn: () => orderService.getPaymentHistories(),
        enabled: hasToken,
    });

    // Logout if token invalid or error fetching profile
    useEffect(() => {
        if (profileError) {
            console.log("profileError", profileError);
            handleLogout();
        }
    }, [profileError]);

    const courseInfo = useMemo(() => {
        const orders = courseInfoRaw?.orders || [];
        return orders.reduce((acc: any[], order: any) => {
            const orderCourses = order.courses.map((item: any) => ({
                ...item.course,
                orderId: order._id,
                orderStatus: order.status
            }));
            return [...acc, ...orderCourses];
        }, []);
    }, [courseInfoRaw]);

    const paymentInfo = useMemo(() => {
        return paymentInfoRaw?.orders || [];
    }, [paymentInfoRaw]);

    const handleShowModal = (modalType: string) => {
        if (!tokenMethod.get()) {
            setShowedModal(modalType || "");
        }
    };

    const handleCloseModal = (e?: React.MouseEvent | any) => {
        e?.stopPropagation();
        setShowedModal("");
    }

    const handleLogin = async (loginData: any, callback?: () => void) => {
        try {
            const res = await authService.login(loginData);
            const accessToken = res?.data?.data?.token;
            tokenMethod.set(accessToken);

            if (tokenMethod.get()) {
                refetchProfile();
                refetchCourseInfo();
                refetchPaymentInfo();
                message.success("Đăng nhập thành công!");
                handleCloseModal();
            }
        } catch (error) {
            console.log("error", error);
            message.error(
                (error as any)?.response?.data?.message || "Đăng nhập thất bại"
            );
        } finally {
            callback?.();
        }
    };

    const handleRegister = async (registerData: any, callback: () => void) => {
        try {
            const { name, email, password } = registerData || {};
            const payload = {
                firstName: name,
                lastName: "",
                email,
                password,
            }
            const res = await authService.register(payload);
            if (res?.data?.data?.id) {
                message.success("Đăng ký thành công!");
                handleLogin({ email, password });
            }
        } catch (error) {
            console.log("error", error);
            message.error(
                (error as any)?.response?.data?.message || "Đăng ký thất bại!"
            );
        } finally {
            callback();
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout API error", error);
        }
        tokenMethod.remove();
        queryClient.clear();
        navigate(PATHS.HOME);
        message.success("Tài khoản đã đăng xuất thành công");
    };

    const handleGetProfileCourse = async () => {
        await refetchCourseInfo();
    };

    const handleGetProfilePayment = async () => {
        await refetchPaymentInfo();
    };

    const handleUpdateProfile = async (profileData: any) => {
        try {
            const { firstName, email, facebookURL, introduce, phone, website, avatar } = profileData;
            const payload = {
                firstName: firstName,
                lastName: "",
                email,
                facebookURL,
                website,
                introduce,
                phone,
                avatar,
            };
            const res = await authService.updateProfile(payload);
            if (res?.data?.data?.id) {
                message.success("Cập nhật thông tin thành công");
                refetchProfile();
            }
        } catch (error) {
            console.log("error", error);
            message.error(
                (error as any)?.response?.data?.message || "Cập nhật thông tin thất bại!"
            );
        }
    };

    return (
        <AuthContext.Provider value={{
            showedModal,
            profile,
            courseInfo,
            paymentInfo,
            handleShowModal,
            handleCloseModal,
            handleLogin,
            handleRegister,
            handleLogout,
            handleGetProfileCourse,
            handleGetProfilePayment,
            handleUpdateProfile,
        }} >
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContextProvider;

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};
