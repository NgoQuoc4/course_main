// models/Customer.js
// Schema định nghĩa thông tin khách hàng (người dùng)

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        // Họ tên
        firstName: {
            type: String,
            required: [true, "Vui lòng nhập họ tên"],
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            default: "",
        },
        // Email đăng nhập (duy nhất)
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        // Mật khẩu đã được hash
        password: {
            type: String,
            required: [true, "Vui lòng nhập mật khẩu"],
            minlength: 6,
            select: false, // Không trả về password khi query
        },
        // Ảnh đại diện
        avatar: {
            type: String,
            default: "",
        },
        // Số điện thoại
        phone: {
            type: String,
            default: "",
        },
        // Giới thiệu bản thân
        introduce: {
            type: String,
            default: "",
        },
        // Facebook URL
        facebookURL: {
            type: String,
            default: "",
        },
        // Website cá nhân
        website: {
            type: String,
            default: "",
        },
        // Vai trò: Liên kết tới collection Role
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
        },
        // Refresh token lưu trong DB để kiểm tra hợp lệ
        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
    }
);

module.exports = mongoose.model("Customer", customerSchema);
