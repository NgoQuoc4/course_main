// models/Order.js
// Schema định nghĩa đơn hàng / lịch sử mua khóa học

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // Khách hàng đặt hàng
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        // Danh sách khóa học trong đơn hàng
        courses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course",
                    required: true,
                },
                // Giá tại thời điểm mua (lưu lại để tránh thay đổi giá sau)
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        // Tổng tiền
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        // Trạng thái đơn hàng
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled", "refunded"],
            default: "pending",
        },
        // Phương thức thanh toán
        paymentMethod: {
            type: String,
            enum: ["banking", "momo", "zalopay", "free", "cash", "atm"],
            default: "banking",
        },
        // Mã giao dịch từ cổng thanh toán
        transactionId: {
            type: String,
            default: "",
        },
        // Thông tin snapshot người mua tại thời điểm đặt hàng
        name: String,
        phone: String,
        email: String,
        // Hình thức học
        type: String,
        // Ghi chú
        note: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
