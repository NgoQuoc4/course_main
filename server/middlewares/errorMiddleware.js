// middlewares/errorMiddleware.js
// Xử lý lỗi tập trung cho toàn bộ ứng dụng
// ======================================================================
// Mọi lỗi từ Controllers và Services đều dồn về đây.
// catchAsync(...) tự động gọi next(err) nên lỗi luôn tới middleware này.
// ======================================================================

/**
 * Middleware xử lý route không tồn tại (404)
 */
const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy endpoint: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Middleware xử lý lỗi chung (Global Error Handler)
 * Express nhận ra đây là error middleware vì có 4 tham số (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
    // Ưu tiên statusCode từ Service layer (err.statusCode),
    // sau đó từ res.statusCode, cuối cùng mặc định 500
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message;

    // Lỗi CastError của Mongoose: ID không hợp lệ
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "Không tìm thấy tài nguyên.";
    }

    // Lỗi trùng lặp dữ liệu (duplicate key)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} đã tồn tại trong hệ thống.`;
    }

    // Lỗi validation của Mongoose
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }

    // Lỗi JWT
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Token không hợp lệ.";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token đã hết hạn.";
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Chỉ hiển thị stack trace trong môi trường development
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = { notFound, errorHandler };
