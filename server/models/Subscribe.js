// models/Subscribe.js
// Schema định nghĩa người đăng ký nhận tin tức (newsletter)

const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema(
    {
        // Email đăng ký
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        // Tên (tùy chọn)
        name: {
            type: String,
            default: "",
        },
        // Trạng thái: active (đang đăng ký), unsubscribed (đã hủy)
        status: {
            type: String,
            enum: ["active", "unsubscribed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Subscribe", subscribeSchema);
