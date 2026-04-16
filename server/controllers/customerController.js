// controllers/customerController.js
// Controller xử lý Customer - LỚP MỎNG chỉ gọi Service và trả Response
// ======================================================================
// TRƯỚC: Toàn bộ logic (hash password, check email, tạo token) viết ở đây
// SAU:   Controller chỉ nhận req → gọi service → trả res.json()
// ======================================================================

const catchAsync = require("../utils/catchAsync");
const customerService = require("../services/customerService");

/**
 * @desc    Đăng ký tài khoản mới
 * @route   POST /customer/register
 * @access  Public
 */
const registerCustomer = catchAsync(async (req, res) => {
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
const loginCustomer = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const data = await customerService.login({ email, password });

    res.status(200).json({
        success: true,
        message: "Đăng nhập thành công.",
        data,
    });
});

/**
 * @desc    Làm mới Access Token bằng Refresh Token
 * @route   PUT /customer/refresh
 * @access  Public
 */
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken: token } = req.body;

    const data = await customerService.refresh(token);

    res.status(200).json({
        success: true,
        data,
    });
});

/**
 * @desc    Lấy thông tin hồ sơ
 * @route   GET /customer/profiles
 * @access  Private (Cần JWT)
 */
const getProfile = catchAsync(async (req, res) => {
    const customer = req.customer;

    res.status(200).json({
        success: true,
        data: {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            avatar: customer.avatar,
            phone: customer.phone,
            introduce: customer.introduce,
            facebookURL: customer.facebookURL,
            website: customer.website,
            role: customer.role,
            createdAt: customer.createdAt,
        },
    });
});

/**
 * @desc    Cập nhật thông tin hồ sơ
 * @route   PUT /customer/profiles
 * @access  Private (Cần JWT)
 */
const updateProfile = catchAsync(async (req, res) => {
    const avatarUrl = req.file ? req.file.path : null;

    const updatedCustomer = await customerService.updateProfile(
        req.customer._id,
        req.body,
        avatarUrl
    );

    res.status(200).json({
        success: true,
        message: "Cập nhật hồ sơ thành công.",
        data: {
            id: updatedCustomer._id,
            firstName: updatedCustomer.firstName,
            lastName: updatedCustomer.lastName,
            email: updatedCustomer.email,
            avatar: updatedCustomer.avatar,
            phone: updatedCustomer.phone,
            introduce: updatedCustomer.introduce,
            facebookURL: updatedCustomer.facebookURL,
            website: updatedCustomer.website,
        },
    });
});

module.exports = {
    registerCustomer,
    loginCustomer,
    refreshToken,
    getProfile,
    updateProfile,
};

