import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IBlogCategory {
    name: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    isActive: boolean;
}

export interface IBlogCategoryDocument extends IBlogCategory, Document {
    _id: any;
}

const blogCategorySchema = new Schema<IBlogCategoryDocument>(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên danh mục"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
        },
        thumbnail: {
            type: String,
            default: "",
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

blogCategorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, locale: "vi" });
    }
    next();
});

export default mongoose.model<IBlogCategoryDocument>("BlogCategory", blogCategorySchema);
