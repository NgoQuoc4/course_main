import mongoose, { Schema, Document } from "mongoose";

export interface IRole {
    name: string;
    slug: string;
    description?: string;
}

export interface IRoleDocument extends IRole, Document {
    _id: any;
}

const roleSchema = new Schema<IRoleDocument>(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên vai trò"],
            unique: true,
        },
        slug: {
            type: String,
            required: [true, "Vui lòng nhập mã vai trò"],
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IRoleDocument>("Role", roleSchema);
