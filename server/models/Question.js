// models/Question.js
// Schema định nghĩa câu hỏi thường gặp (FAQ)

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        // Câu hỏi
        question: {
            type: String,
            required: [true, "Vui lòng nhập câu hỏi"],
            trim: true,
        },
        // Câu trả lời
        answer: {
            type: String,
            required: [true, "Vui lòng nhập câu trả lời"],
        },
        // Nhóm câu hỏi (phân loại)
        category: {
            type: String,
            default: "general",
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

module.exports = mongoose.model("Question", questionSchema);
