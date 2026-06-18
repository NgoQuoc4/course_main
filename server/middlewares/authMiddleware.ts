import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, Role } from "@prisma/client";
import prisma from "../config/prisma.js";

// Extend Express Request to include customer
declare global {
  namespace Express {
    interface Request {
      customer?: Omit<User, "password"> & { id: string; _id: string; role: Role | null };
    }
  }
}

/**
 * Middleware xác thực Access Token
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const customer = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại.",
      });
    }

    // Xóa trường password bảo mật trước khi gán
    const { password, ...customerWithoutPassword } = customer;

    req.customer = {
      ...customerWithoutPassword,
      _id: customerWithoutPassword.id, // Hỗ trợ trường _id cho các controller dùng mongoose cũ
    };
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
    console.log("req.customer", req.customer);
    if (!req.customer || !req.customer.role) {
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập hoặc quyền không hợp lệ.",
      });
    }

    const userRoleSlug = (req.customer.role as any).slug?.toUpperCase();
    const upperAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

    if (upperAllowedRoles.includes(userRoleSlug)) {
      return next();
    }

    if (userRoleSlug === "CUSTOMER" || userRoleSlug === "USER") {
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
