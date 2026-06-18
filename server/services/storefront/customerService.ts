import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import { createNotification } from "../admin/notificationService.js";

/**
 * Tạo cặp token (access + refresh)
 */
export const generateTokens = (id: string | any) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any,
    });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,
    });
    return { accessToken, refreshToken };
};

/**
 * Đăng ký tài khoản mới
 */
export const register = async ({ firstName, lastName, email, password }: any) => {
    // Kiểm tra email trùng
    const existingCustomer = await prisma.user.findUnique({
        where: { email }
    });
    if (existingCustomer) {
        throw { message: "Email đã được sử dụng để đăng ký tài khoản.", statusCode: 403 };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Lấy role mặc định là 'USER'
    const defaultRole = await prisma.role.findFirst({
        where: { slug: "USER" }
    });

    // Tạo customer
    const customer = await prisma.user.create({
        data: {
            firstName,
            lastName: lastName || "",
            email,
            password: hashedPassword,
            roleId: defaultRole?.id,
            avatar: "",
            phone: "",
            introduce: "",
            facebookUrl: "",
            website: "",
            refreshToken: "",
        }
    });

    // Tạo thông báo cho Admin
    try {
        await createNotification({
            title: "Thành viên mới đăng ký",
            message: `Học viên ${firstName} ${lastName || ""} (${email}) vừa tạo tài khoản mới.`,
            type: "user",
            referenceId: customer.id,
        });
    } catch (err) {
        console.error("Lỗi tạo thông báo:", err);
    }

    return {
        id: customer.id,
        firstName: customer.firstName,
        email: customer.email,
    };
};

/**
 * Đăng nhập
 */
export const login = async ({ email, password }: any) => {
    const customer = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
    });

    if (!customer) {
        throw { message: "Email hoặc mật khẩu không chính xác.", statusCode: 401 };
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password);
    if (!isPasswordMatch) {
        throw { message: "Email hoặc mật khẩu không chính xác.", statusCode: 401 };
    }

    const { accessToken, refreshToken } = generateTokens(customer.id);

    // Lưu refresh token vào DB
    await prisma.user.update({
        where: { id: customer.id },
        data: { refreshToken }
    });

    return {
        token: accessToken,
        refreshToken,
        customer: {
            id: customer.id,
            firstName: customer.firstName,
            email: customer.email,
            role: customer.role?.slug || "USER",
        },
    };
};

/**
 * Làm mới Access Token
 */
export const refresh = async (token: string) => {
    if (!token) {
        throw { message: "Refresh token không được cung cấp.", statusCode: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    const customer = await prisma.user.findUnique({
        where: { id: decoded.id }
    });

    if (!customer || customer.refreshToken !== token) {
        throw { message: "Refresh token không hợp lệ hoặc đã hết hạn.", statusCode: 401 };
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(customer.id);
    await prisma.user.update({
        where: { id: customer.id },
        data: { refreshToken: newRefreshToken }
    });

    return { token: accessToken, refreshToken: newRefreshToken };
};

/**
 * Cập nhật profile
 */
export const updateProfile = async (customerId: string, updateData: any, avatarUrl: string | null = null) => {
    const currentCustomer = await prisma.user.findUnique({
        where: { id: customerId }
    });
    if (!currentCustomer) {
        throw { message: "Không tìm thấy người dùng.", statusCode: 404 };
    }

    // Kiểm tra email trùng
    if (updateData.email && updateData.email !== currentCustomer.email) {
        const emailExists = await prisma.user.findFirst({
            where: {
                email: updateData.email,
                id: { not: customerId },
            }
        });
        if (emailExists) {
            throw { message: "Email này đã được sử dụng bởi tài khoản khác.", statusCode: 400 };
        }
    }

    const updatedCustomer = await prisma.user.update({
        where: { id: customerId },
        data: {
            firstName: updateData.firstName || currentCustomer.firstName,
            lastName: updateData.lastName !== undefined ? updateData.lastName : currentCustomer.lastName,
            email: updateData.email || currentCustomer.email,
            phone: updateData.phone !== undefined ? updateData.phone : currentCustomer.phone,
            introduce: updateData.introduce !== undefined ? updateData.introduce : currentCustomer.introduce,
            facebookUrl: updateData.facebookURL !== undefined ? updateData.facebookURL : currentCustomer.facebookUrl,
            website: updateData.website !== undefined ? updateData.website : currentCustomer.website,
            avatar: avatarUrl || updateData.avatar || currentCustomer.avatar,
        }
    });

    return {
        ...updatedCustomer,
        _id: updatedCustomer.id,
        facebookURL: updatedCustomer.facebookUrl, // map back to facebookURL
    };
};
