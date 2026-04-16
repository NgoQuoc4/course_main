// models/Team.js
// Schema định nghĩa thành viên đội ngũ giảng viên / nhân sự

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        // Tên giảng viên
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên"],
            trim: true,
        },
        // Vị trí / chức danh
        position: {
            type: String,
            default: "",
        },
        // Ảnh đại diện
        avatar: {
            type: String,
            default: "",
        },
        // Mô tả bản thân / kinh nghiệm
        description: {
            type: String,
            default: "",
        },
        // Mạng xã hội
        socialLinks: {
            facebook: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            website: { type: String, default: "" },
        },
        // Thứ tự hiển thị
        order: {
            type: Number,
            default: 0,
        },
        // Trạng thái hiển thị
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Team", teamSchema);
