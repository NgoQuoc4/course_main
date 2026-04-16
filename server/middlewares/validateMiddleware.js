// middlewares/validateMiddleware.js
// Kiểm tra dữ liệu đầu vào sử dụng express-validator

const { body, validationResult } = require("express-validator");

/**
 * Hàm xử lý kết quả validation, trả về lỗi nếu có
 * Được dùng sau các chuỗi validation rules
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu đầu vào không hợp lệ.",
            errors: errors.array().map((e) => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }
    next();
};

/**
 * Rules kiểm tra dữ liệu đăng ký tài khoản
 */
const validateRegister = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("Vui lòng nhập họ tên")
        .isLength({ min: 2 })
        .withMessage("Họ tên phải có ít nhất 2 ký tự"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Vui lòng nhập email")
        .isEmail()
        .withMessage("Email không đúng định dạng"),
    body("password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu")
        .isLength({ min: 6 })
        .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
    handleValidationErrors,
];

/**
 * Rules kiểm tra dữ liệu đăng nhập
 */
const validateLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Vui lòng nhập email")
        .isEmail()
        .withMessage("Email không đúng định dạng"),
    body("password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu"),
    handleValidationErrors,
];

/**
 * Rules kiểm tra dữ liệu đặt hàng
 */
const validateOrder = [
    body("courses")
        .isArray({ min: 1 })
        .withMessage("Vui lòng chọn ít nhất 1 khóa học"),
    body("courses.*.course")
        .notEmpty()
        .withMessage("ID khóa học không hợp lệ"),
    handleValidationErrors,
];

/**
 * Rules kiểm tra email đăng ký nhận tin tức
 */
const validateSubscribe = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Vui lòng nhập email")
        .isEmail()
        .withMessage("Email không đúng định dạng"),
    handleValidationErrors,
];

module.exports = {
    validateRegister,
    validateLogin,
    validateOrder,
    validateSubscribe,
    handleValidationErrors,
};
