// models/BlogCategory.js
// Schema định nghĩa danh mục bài viết blog

const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
    {
        // Tên danh mục
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên danh mục"],
            trim: true,
        },
        // Slug URL
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        // Mô tả
        description: {
            type: String,
            default: "",
        },
        // Ảnh đại diện
        thumbnail: {
            type: String,
            default: "",
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

// Tự động tạo slug từ name
blogCategorySchema.pre("save", function (next) {
    if (this.isModified("name") && !this.slug) {
        const slugify = require("slugify");
        this.slug = slugify(this.name, { lower: true, locale: "vi" });
    }
    next();
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
