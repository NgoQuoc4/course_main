// middlewares/authMiddleware.js
// Xác thực JWT token trong mỗi request cần bảo mật

const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

/**
 * Middleware xác thực Access Token
 * Được dùng cho các route yêu cầu đăng nhập
 */
const protect = async (req, res, next) => {
    let token;

    // Trích xuất token từ header Authorization: Bearer <token>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Kiểm tra token có tồn tại không
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.",
        });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy thông tin customer từ DB (không lấy password) và populate role
        const customer = await Customer.findById(decoded.id)
            .select("-password")
            .populate("role");

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại.",
            });
        }

        // Gắn thông tin customer vào request để các controller sử dụng
        req.customer = customer;
        next();
    } catch (error) {
        // Token hết hạn hoặc không hợp lệ
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
 * @param {...string} allowedRoles - Danh sách các slug roles được phép (admin, teacher, customer)
 */
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Kiểm tra user đã login chưa (qua protect middleware)
        if (!req.customer || !req.customer.role) {
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập hoặc quyền không hợp lệ.",
            });
        }

        const userRoleSlug = req.customer.role.slug;

        // 2. Nếu role nằm trong danh sách cho phép -> cho qua
        if (allowedRoles.includes(userRoleSlug)) {
            return next();
        }

        // 3. Nếu không có quyền:
        // Case A: Nếu là 'customer' truy cập trang admin -> Yêu cầu redirect về Home (sử lý trên server)
        if (userRoleSlug === "customer") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền truy cập trang quản trị.",
                redirectTo: "/", // Server báo cho client biết cần về Home
            });
        }

        // Case B: Các trường hợp khác (ví dụ teacher vào phần User Management) -> Báo lỗi cấm
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền thực hiện thao tác này.",
            showNoPermission: true, // Server báo cho client biết cần hiện giao diện No Permission
        });
    };
};

module.exports = { protect, restrictTo };
