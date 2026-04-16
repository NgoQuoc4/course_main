const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên vai trò"],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Vui lòng nhập mã vai trò"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        permissions: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Role", roleSchema);
