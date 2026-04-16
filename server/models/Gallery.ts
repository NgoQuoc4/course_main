import mongoose, { Schema, Document } from "mongoose";

export interface IGallery {
    title?: string;
    imageUrl: string;
    description?: string;
    category: "classroom" | "event" | "certificate" | "other";
    order: number;
    isActive: boolean;
}

export interface IGalleryDocument extends IGallery, Document {
    _id: any;
}

const gallerySchema = new Schema<IGalleryDocument>(
    {
        title: {
            type: String,
            trim: true,
            default: "",
        },
        imageUrl: {
            type: String,
            required: [true, "Vui lòng nhập URL ảnh"],
        },
        description: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            enum: ["classroom", "event", "certificate", "other"],
            default: "other",
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

export default mongoose.model<IGalleryDocument>("Gallery", gallerySchema);
