import mongoose, { Schema, Document } from "mongoose";

export interface ISubscribe {
    email: string;
    name?: string;
    status: "active" | "unsubscribed";
}

export interface ISubscribeDocument extends ISubscribe, Document {
    _id: any;
}

const subscribeSchema = new Schema<ISubscribeDocument>(
    {
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["active", "unsubscribed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ISubscribeDocument>("Subscribe", subscribeSchema);
