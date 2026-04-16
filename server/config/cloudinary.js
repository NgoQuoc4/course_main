// config/cloudinary.js
// Cấu hình Cloudinary để upload ảnh và thiết lập multer middleware

const cloudinary = require("cloudinary"); // Cloudinary v1
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cấu hình kết nối Cloudinary từ biến môi trường
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình nơi lưu trữ ảnh trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "cfdcourse/avatars", // Thư mục lưu ảnh trên Cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        transformation: [{ width: 500, height: 500, crop: "fill" }], // Auto resize
    },
});

// Export multer middleware đã cấu hình với Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
