// src/utils/catchAsync.js
// Wrapper hàm async để tự động bắt lỗi và chuyển cho Error Handler
// ======================================================================
// TRƯỚC: phải viết try/catch trong mỗi controller
// SAU:   const login = catchAsync(async (req, res) => { ... });
//        Lỗi tự động được next(err) -> errorHandler middleware
// ======================================================================

/**
 * Bọc hàm async controller để tự động bắt lỗi
 * @param {Function} fn - Hàm async controller
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;
