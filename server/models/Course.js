// models/Course.js
// Schema định nghĩa khóa học

const mongoose = require("mongoose");

// Sub-schema cho các mục học (lesson) trong chương
const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: String, default: "" }, // Thời lượng: "10:30"
    isPreview: { type: Boolean, default: false }, // Có thể xem thử không
});

// Sub-schema cho chương học (chapter/section)
const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
    {
        // Tiêu đề khóa học
        title: {
            type: String,
            required: [true, "Vui lòng nhập tiêu đề khóa học"],
            trim: true,
        },
        // Slug dùng cho URL thân thiện (vd: "html-css-basics")
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        // Mô tả ngắn
        shortDescription: {
            type: String,
            default: "",
        },
        // Mô tả chi tiết (HTML hoặc markdown)
        description: {
            type: String,
            default: "",
        },
        // Ảnh thumbnail
        thumbnail: {
            type: String,
            default: "",
        },
        // Giá gốc (VNĐ)
        price: {
            type: Number,
            default: 0,
        },
        // Giá khuyến mãi
        salePrice: {
            type: Number,
            default: 0,
        },
        // Trạng thái: active, inactive, draft
        status: {
            type: String,
            enum: ["active", "inactive", "draft"],
            default: "active",
        },
        // Cấp độ: beginner, intermediate, advanced
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        // Ngôn ngữ giảng dạy
        language: {
            type: String,
            default: "Tiếng Việt",
        },
        // Danh sách chương học
        chapters: [chapterSchema],
        // Yêu cầu đầu vào (kiến thức cần có)
        requirements: [String],
        // Kết quả đạt được sau khóa học
        outcomes: [String],
        // Tags phân loại
        tags: [String],
        // Số học viên đã đăng ký
        enrollCount: {
            type: Number,
            default: 0,
        },
        // Đánh giá trung bình
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        // Giảng viên (tham chiếu sang collection Customer)
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
    },
    {
        timestamps: true,
    }
);

// Tự động tạo slug từ title trước khi lưu
courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        const slugify = require("slugify");
        this.slug = slugify(this.title, { lower: true, locale: "vi" });
    }
    next();
});

module.exports = mongoose.model("Course", courseSchema);
