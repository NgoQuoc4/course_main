import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";
import { ICourse, IChapter, ILesson } from "../../types/course.js";

export interface ICourseDocument extends ICourse, Document {
    _id: any;
}

const lessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    duration: { type: String, default: "" },
    isPreview: { type: Boolean, default: false },
    content: { type: String, default: "" },
});

const chapterSchema = new Schema<IChapter>({
    title: { type: String, required: true },
    lessons: [lessonSchema],
});

const courseSchema = new Schema<ICourseDocument>(
    {
        title: {
            type: String,
            required: [true, "Vui lòng nhập tiêu đề khóa học"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        shortDescription: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        thumbnail: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            default: 0,
        },
        salePrice: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "draft"],
            default: "active",
        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        language: {
            type: String,
            default: "Tiếng Việt",
        },
        chapters: [chapterSchema],
        requirements: [String],
        outcomes: [String],
        tags: [String],
        enrollCount: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
        },
    },
    {
        timestamps: true,
    }
);

courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, locale: "vi" });
    }
    next();
});

export default mongoose.model<ICourseDocument>("Course", courseSchema);
