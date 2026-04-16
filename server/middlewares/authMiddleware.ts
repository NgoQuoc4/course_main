import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Customer, { ICustomerDocument } from "../models/Customer.js";

// Extend Express Request to include customer
declare global {
    namespace Express {
        interface Request {
            customer?: ICustomerDocument;
        }
    }
}

/**
 * Middleware xác thực Access Token
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const customer = await Customer.findById(decoded.id)
            .select("-password")
            .populate("role");

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại.",
            });
        }

        req.customer = customer;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token đã hết hạn.",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ.",
        });
    }
};

/**
 * Middleware phân quyền linh hoạt
 */
export const restrictTo = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.customer || !req.customer.role) {
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập hoặc quyền không hợp lệ.",
            });
        }

        const userRoleSlug = (req.customer.role as any).slug;

        if (allowedRoles.includes(userRoleSlug)) {
            return next();
        }

        if (userRoleSlug === "customer") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền truy cập trang quản trị.",
                redirectTo: "/",
            });
        }

        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền thực hiện thao tác này.",
            showNoPermission: true,
        });
    };
};
