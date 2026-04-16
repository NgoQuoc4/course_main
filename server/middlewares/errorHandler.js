/**
 * Cấu trúc lỗi tùy chỉnh
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        // Có thể thêm phân loại lỗi cho Production (CastError, ValidationError, JWTError, etc.)
        let error = { ...err };
        error.message = err.message;

        if (err.name === "CastError") error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === "ValidationError") error = handleValidationErrorDB(error);
        if (err.name === "JsonWebTokenError") error = handleJWTError();
        if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // B) Programming or other unknown error: don't leak error details
    else {
        console.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Đã có lỗi xảy ra trên hệ thống!",
        });
    }
};

// Hàm xử lý các loại lỗi MongoDB thường gặp
const handleCastErrorDB = (err) => {
    const message = `Dữ liệu không hợp lệ: ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Dữ liệu đã tồn tại: ${value}. Vui lòng sử dụng giá trị khác!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Dữ liệu không hợp lệ. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError("Token không hợp lệ. Vui lòng đăng nhập lại!", 401);

const handleJWTExpiredError = () =>
    new AppError("Token đã hết hạn. Vui lòng đăng nhập lại!", 401);

module.exports = { AppError, errorHandler };
