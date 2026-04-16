import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
}

export interface IQuestionDocument extends IQuestion, Document {
    _id: any;
}

const questionSchema = new Schema<IQuestionDocument>(
    {
        question: {
            type: String,
            required: [true, "Vui lòng nhập câu hỏi"],
            trim: true,
        },
        answer: {
            type: String,
            required: [true, "Vui lòng nhập câu trả lời"],
        },
        category: {
            type: String,
            default: "general",
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IQuestionDocument>("Question", questionSchema);
