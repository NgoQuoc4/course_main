import PATHS from "@/constants/paths";
import { authService } from "@/features/auth/services/authService";
import { orderService } from "@/features/order/services/orderService";
import tokenMethod from "@/utils/token";
import { message } from "antd";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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
    handleLogin: (loginData: any) => Promise<void>;
    handleRegister: (registerData: any, callback: () => void) => Promise<void>;
    handleLogout: () => void;
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
    const [profile, setProfile] = useState<IUser | undefined>();
    const [courseInfo, setCourseInfo] = useState<(ICourse & { orderId: string; orderStatus: string })[]>([]);
    const [paymentInfo, setPaymentInfo] = useState<IOrder[]>([]);
    const navigate = useNavigate();

    const handleShowModal = (modalType: string) => {
        if (!tokenMethod.get()) {
            setShowedModal(modalType || "");
        }
    };

    const handleCloseModal = (e?: React.MouseEvent | any) => {
        e?.stopPropagation();
        setShowedModal("");
    }

    useEffect(() => {
        if (tokenMethod.get()) {
            handleGetProfile();
            handleGetProfileCourse();
            handleGetProfilePayment();
        }
    }, []);

    const handleLogin = async (loginData: any) => {
        try {
            const res = await authService.login(loginData);
            const { token: accessToken, refreshToken } = res?.data?.data || {};
            tokenMethod.set({ accessToken, refreshToken });

            if (tokenMethod.get()) {
                handleGetProfile();
                handleGetProfileCourse();
                handleGetProfilePayment();
                message.success("Đăng nhập thành công!");
                handleCloseModal();
            }
        } catch (error) {
            console.log("error", error);
            message.error("Đăng nhập thất bại");
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
            if ((error as any)?.response?.status === 403) {
                message.error("Email đăng ký đã tồn tại!");
            } else {
                message.error("Đăng ký thất bại!");
            }
        } finally {
            callback();
        }
    };

    const handleLogout = () => {
        tokenMethod.remove();
        setProfile(undefined);
        navigate(PATHS.HOME);
        message.success("Tài khoản đã đăng xuất thành công");
    };

    const handleGetProfile = async () => {
        try {
            const profileRes = await authService.getProfiles();
            if (profileRes?.data?.data) {
                setProfile(profileRes.data.data)
            }
        } catch (error) {
            console.log("error", error);
            handleLogout();
        }
    };

    const handleGetProfileCourse = async () => {
        try {
            const res = await orderService.getCourseHistories();
            const orders = res?.data?.data?.orders || [];
            const allCourses = orders.reduce((acc: any[], order: any) => {
                const orderCourses = order.courses.map((item: any) => ({
                    ...item.course,
                    orderId: order._id,
                    orderStatus: order.status
                }));
                return [...acc, ...orderCourses];
            }, []);
            
            setCourseInfo(allCourses);
        } catch (error) {
            console.log("getCoursesHistories error", error);
        }
    };

    const handleGetProfilePayment = async () => {
        try {
            const res = await orderService.getPaymentHistories();
            const payments = res?.data?.data?.orders || [];
            setPaymentInfo(payments);
        } catch (error) {
            console.log("getPaymentHistories error", error);
        }
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
                handleGetProfile();
            }
        } catch (error) {
            console.log("error", error);
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
