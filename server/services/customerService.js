// src/services/customerService.js
// Tầng Business Logic cho Customer
// ======================================================================
// TẤT CẢ logic xử lý nghiệp vụ nằm ở đây.
// Controller chỉ gọi service, nhận kết quả, trả response.
// Lợi ích: Tái sử dụng được, dễ viết Unit Test.
// ======================================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Role = require("../models/Role");

/**
 * Tạo cặp token (access + refresh)
 */
const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
    return { accessToken, refreshToken };
};

/**
 * Đăng ký tài khoản mới
 * @param {{ firstName, lastName, email, password }} data
 * @returns {{ id, firstName, email }}
 * @throws {Error} nếu email đã tồn tại
 */
const register = async ({ firstName, lastName, email, password }) => {
    // Kiểm tra email trùng
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
        const error = new Error("Email đã được sử dụng để đăng ký tài khoản.");
        error.statusCode = 403;
        throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Lấy role mặc định là 'customer'
    const defaultRole = await Role.findOne({ slug: "customer" });

    // Tạo customer
    const customer = await Customer.create({
        firstName,
        lastName: lastName || "",
        email,
        password: hashedPassword,
        role: defaultRole?._id,
    });

    return {
        id: customer._id,
        firstName: customer.firstName,
        email: customer.email,
    };
};

/**
 * Đăng nhập
 * @param {{ email, password }} data
 * @returns {{ token, refreshToken, customer }}
 * @throws {Error} nếu thông tin sai
 */
const login = async ({ email, password }) => {
    const customer = await Customer.findOne({ email })
        .select("+password")
        .populate("role");
    if (!customer) {
        const error = new Error("Email hoặc mật khẩu không chính xác.");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password);
    if (!isPasswordMatch) {
        const error = new Error("Email hoặc mật khẩu không chính xác.");
        error.statusCode = 401;
        throw error;
    }

    const { accessToken, refreshToken } = generateTokens(customer._id);

    // Lưu refresh token vào DB
    await Customer.findByIdAndUpdate(customer._id, { refreshToken });

    return {
        token: accessToken,
        refreshToken,
        customer: {
            id: customer._id,
            firstName: customer.firstName,
            email: customer.email,
            role: customer.role?.slug || "customer",
        },
    };
};

/**
 * Làm mới Access Token
 * @param {string} token - Refresh token hiện tại
 * @returns {{ token, refreshToken }}
 */
const refresh = async (token) => {
    if (!token) {
        const error = new Error("Refresh token không được cung cấp.");
        error.statusCode = 401;
        throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const customer = await Customer.findById(decoded.id);

    if (!customer || customer.refreshToken !== token) {
        const error = new Error("Refresh token không hợp lệ hoặc đã hết hạn.");
        error.statusCode = 401;
        throw error;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(customer._id);
    await Customer.findByIdAndUpdate(customer._id, { refreshToken: newRefreshToken });

    return { token: accessToken, refreshToken: newRefreshToken };
};

/**
 * Cập nhật profile
 * @param {string} customerId
 * @param {object} updateData
 * @param {string|null} avatarUrl
 * @returns {object} updated customer
 */
const updateProfile = async (customerId, updateData, avatarUrl = null) => {
    const currentCustomer = await Customer.findById(customerId);

    // Kiểm tra email trùng
    if (updateData.email && updateData.email !== currentCustomer.email) {
        const emailExists = await Customer.findOne({
            email: updateData.email,
            _id: { $ne: customerId },
        });
        if (emailExists) {
            const error = new Error("Email này đã được sử dụng bởi tài khoản khác.");
            error.statusCode = 400;
            throw error;
        }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
            firstName: updateData.firstName || currentCustomer.firstName,
            lastName: updateData.lastName !== undefined ? updateData.lastName : currentCustomer.lastName,
            email: updateData.email || currentCustomer.email,
            phone: updateData.phone !== undefined ? updateData.phone : currentCustomer.phone,
            introduce: updateData.introduce !== undefined ? updateData.introduce : currentCustomer.introduce,
            facebookURL: updateData.facebookURL !== undefined ? updateData.facebookURL : currentCustomer.facebookURL,
            website: updateData.website !== undefined ? updateData.website : currentCustomer.website,
            avatar: avatarUrl || updateData.avatar || currentCustomer.avatar,
        },
        { new: true, runValidators: true }
    );

    return updatedCustomer;
};

/**
 * Lấy danh sách người dùng (Admin)
 */
const getUsers = async ({ search, role, page = 1, limit = 10 }) => {
    const filter = {};
    if (role) {
        // Nếu role là slug (string không phải ObjectID), tìm ID tương ứng để filter chính xác
        if (typeof role === "string" && !role.match(/^[0-9a-fA-F]{24}$/)) {
            const roleObj = await Role.findOne({ slug: role });
            if (roleObj) filter.role = roleObj._id;
        } else {
            filter.role = role;
        }
    }
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Customer.countDocuments(filter);
    const users = await Customer.find(filter)
        .populate("role")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit));

    return {
        users,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

/**
 * Cập nhật quyền người dùng (Admin)
 */
const updateUserRole = async (userId, roleInput) => {
    let roleId = roleInput;

    // Nếu roleInput là slug (string không phải ObjectID), tìm ID tương ứng
    if (typeof roleInput === "string" && !roleInput.match(/^[0-9a-fA-F]{24}$/)) {
        const role = await Role.findOne({ slug: roleInput });
        if (role) roleId = role._id;
    }

    const user = await Customer.findByIdAndUpdate(
        userId,
        { role: roleId },
        { new: true, runValidators: true }
    ).populate("role");
    if (!user) {
        const error = new Error("Không tìm thấy người dùng.");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

/**
 * Xóa người dùng (Admin)
 */
const deleteUser = async (userId) => {
    const user = await Customer.findByIdAndDelete(userId);
    if (!user) {
        const error = new Error("Không tìm thấy người dùng.");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

module.exports = {
    generateTokens,
    register,
    login,
    refresh,
    updateProfile,
    getUsers,
    updateUserRole,
    deleteUser,
};

