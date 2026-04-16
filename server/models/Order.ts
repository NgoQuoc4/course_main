import mongoose, { Schema, Document } from "mongoose";
import { IOrder } from "../../types/order.js";

export interface IOrderDocument extends IOrder, Document {
    _id: any;
}

const orderSchema = new Schema<IOrderDocument>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Đơn hàng phải thuộc về một khách hàng"],
        },
        courses: [
            {
                course: {
                    type: Schema.Types.ObjectId,
                    ref: "Course",
                },
                price: {
                    type: Number,
                    default: 0,
                }
            },
        ],
        totalAmount: {
            type: Number,
            required: [true, "Đơn hàng phải có tổng giá trị"],
            min: [0, "Giá trị đơn hàng không được nhỏ hơn 0"],
        },
        paymentMethod: {
            type: String,
            default: "cash",
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending",
        },
        note: {
            type: String,
            default: "",
        },
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        type: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IOrderDocument>("Order", orderSchema);
