import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";
import { IBlog } from "../../types/blog.js";

export interface IBlogDocument extends IBlog, Document {
    _id: any;
}

const blogSchema = new Schema<IBlogDocument>(
    {
        title: {
            type: String,
            required: [true, "Vui lòng nhập tiêu đề bài viết"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        excerpt: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            default: "",
        },
        thumbnail: {
            type: String,
            default: "",
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "BlogCategory",
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
        },
        tags: [String],
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "published",
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

blogSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, locale: "vi" });
    }
    next();
});

export default mongoose.model<IBlogDocument>("Blog", blogSchema);
