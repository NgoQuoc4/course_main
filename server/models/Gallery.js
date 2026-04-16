// models/Gallery.js
// Schema định nghĩa ảnh/video gallery của trung tâm

const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        // Tiêu đề ảnh
        title: {
            type: String,
            trim: true,
            default: "",
        },
        // URL ảnh (Cloudinary hoặc link ngoài)
        imageUrl: {
            type: String,
            required: [true, "Vui lòng nhập URL ảnh"],
        },
        // Mô tả
        description: {
            type: String,
            default: "",
        },
        // Danh mục: classroom, event, certificate, other
        category: {
            type: String,
            enum: ["classroom", "event", "certificate", "other"],
            default: "other",
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

module.exports = mongoose.model("Gallery", gallerySchema);
