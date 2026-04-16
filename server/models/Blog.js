// models/Blog.js
// Schema định nghĩa bài viết blog

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        // Tiêu đề bài viết
        title: {
            type: String,
            required: [true, "Vui lòng nhập tiêu đề bài viết"],
            trim: true,
        },
        // Slug URL thân thiện
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        // Mô tả ngắn (hiển thị ở danh sách)
        excerpt: {
            type: String,
            default: "",
        },
        // Nội dung đầy đủ (HTML/Markdown)
        content: {
            type: String,
            default: "",
        },
        // Ảnh bìa
        thumbnail: {
            type: String,
            default: "",
        },
        // Danh mục bài viết
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BlogCategory",
        },
        // Tác giả
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
        // Tags
        tags: [String],
        // Trạng thái: published, draft
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "published",
        },
        // Lượt xem
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Tự động tạo slug từ title
blogSchema.pre("save", function (next) {
    if (this.isModified("title") && !this.slug) {
        const slugify = require("slugify");
        this.slug = slugify(this.title, { lower: true, locale: "vi" });
    }
    next();
});

module.exports = mongoose.model("Blog", blogSchema);
