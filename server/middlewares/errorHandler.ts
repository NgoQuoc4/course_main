import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Use original err for type/code checks as spread doesn't copy all props
        if (err.name === "CastError") error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if (err.name === "ValidationError") error = handleValidationErrorDB(err);
        if (err.name === "JsonWebTokenError") error = handleJWTError();
        if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

const sendErrorDev = (err: any, res: Response) => {
    console.error("DEBUG ERROR 💥", err);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: any, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Đã có lỗi xảy ra trên hệ thống!",
        });
    }
};

const handleCastErrorDB = (err: any) => {
    const message = `Dữ liệu không hợp lệ: ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
    const value = err.errmsg?.match(/(["'])(\\?.)*?\\\1/)?.[0] || "Dữ liệu";
    const message = `Dữ liệu đã tồn tại: ${value}. Vui lòng sử dụng giá trị khác!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Dữ liệu không hợp lệ. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError("Token không hợp lệ. Vui lòng đăng nhập lại!", 401);

const handleJWTExpiredError = () =>
    new AppError("Token đã hết hạn. Vui lòng đăng nhập lại!", 401);

export { AppError };
