import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../../types/user.js";

export interface ICustomerDocument extends IUser, Document {
    _id: any;
    password?: string;
    refreshToken?: string | null;
}

const customerSchema = new Schema<ICustomerDocument>(
    {
        firstName: {
            type: String,
            required: [true, "Vui lòng nhập họ tên"],
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Vui lòng nhập mật khẩu"],
            minlength: 6,
            select: false,
        },
        avatar: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        introduce: {
            type: String,
            default: "",
        },
        facebookURL: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICustomerDocument>("Customer", customerSchema);
