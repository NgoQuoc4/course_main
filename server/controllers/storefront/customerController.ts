import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import * as customerService from "../../services/storefront/customerService.js";

// Helper function to extract a cookie value from Request headers
const getCookie = (req: Request, name: string): string | undefined => {
    const rawCookies = req.headers.cookie;
    if (!rawCookies) return undefined;
    
    const cookies = rawCookies.split(";").reduce((acc: Record<string, string>, cookie) => {
        const parts = cookie.split("=");
        const key = parts[0]?.trim();
        const val = parts.slice(1).join("=").trim();
        if (key) {
            acc[key] = decodeURIComponent(val);
        }
        return acc;
    }, {});
    
    return cookies[name];
};

/**
 * @desc    Đăng ký tài khoản mới
 * @route   POST /customer/register
 * @access  Public
 */
export const registerCustomer = catchAsync(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    const data = await customerService.register({ firstName, lastName, email, password });

    res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công.",
        data,
    });
});

/**
 * @desc    Đăng nhập
 * @route   POST /customer/login
 * @access  Public
 */
export const loginCustomer = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await customerService.login({ email, password });

    // Set Refresh Token in httpOnly secure cookie
    res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove refreshToken from response body to prevent JS access
    const { refreshToken, ...safeData } = data;

    res.status(200).json({
        success: true,
        message: "Đăng nhập thành công.",
        data: safeData,
    });
});

/**
 * @desc    Làm mới Access Token bằng Refresh Token
 * @route   PUT /customer/refresh
 * @access  Public
 */
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = getCookie(req, "refreshToken") || req.body.refreshToken;
    const data = await customerService.refresh(token);

    // Update Refresh Token in cookie
    res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove refreshToken from response body
    const { refreshToken, ...safeData } = data;

    res.status(200).json({
        success: true,
        data: safeData,
    });
});

/**
 * @desc    Đăng xuất
 * @route   POST /customer/logout
 * @access  Public
 */
export const logoutCustomer = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Đăng xuất thành công.",
    });
});

/**
 * @desc    Lấy thông tin hồ sơ
 * @route   GET /customer/profiles
 * @access  Private (Cần JWT)
 */
export const getProfile = catchAsync(async (req: Request, res: Response) => {
    const customer = req.customer;

    if (!customer) {
        throw { message: "Không tìm thấy thông tin khách hàng.", statusCode: 401 };
    }

    res.status(200).json({
        success: true,
        data: {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            avatar: (customer as any).avatar,
            phone: (customer as any).phone,
            introduce: (customer as any).introduce,
            facebookURL: (customer as any).facebookURL,
            website: (customer as any).website,
            role: customer.role,
            createdAt: (customer as any).createdAt,
        },
    });
});

/**
 * @desc    Cập nhật thông tin hồ sơ
 * @route   PUT /customer/profiles
 * @access  Private (Cần JWT)
 */
export const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const avatarUrl = (req as any).file ? (req as any).file.path : null;

    if (!req.customer) {
        throw { message: "Bạn chưa đăng nhập.", statusCode: 401 };
    }

    const updatedCustomer = await customerService.updateProfile(
        req.customer._id,
        req.body,
        avatarUrl
    );

    if (!updatedCustomer) {
        throw { message: "Không tìm thấy khách hàng để cập nhật.", statusCode: 404 };
    }

    res.status(200).json({
        success: true,
        message: "Cập nhật hồ sơ thành công.",
        data: {
            id: updatedCustomer._id,
            firstName: updatedCustomer.firstName,
            lastName: updatedCustomer.lastName,
            email: updatedCustomer.email,
            avatar: (updatedCustomer as any).avatar,
            phone: (updatedCustomer as any).phone,
            introduce: (updatedCustomer as any).introduce,
            facebookURL: (updatedCustomer as any).facebookURL,
            website: (updatedCustomer as any).website,
        },
    });
});
