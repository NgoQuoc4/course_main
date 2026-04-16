const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Role = require("../models/Role");
const Customer = require("../models/Customer");

const seedRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Đã kết nối tới MongoDB...");

        const rolesData = [
            { name: "Administrator", slug: "admin", description: "Toàn quyền quản trị hệ thống" },
            { name: "Teacher", slug: "teacher", description: "Giảng viên có quyền quản lý khóa học và viết bài" },
            { name: "Customer", slug: "customer", description: "Khách hàng/Học viên" },
        ];

        for (const data of rolesData) {
            await Role.findOneAndUpdate({ slug: data.slug }, data, {
                upsert: true,
                new: true,
            });
        }
        console.log("Đã khởi tạo các vai trò thành công.");

        // Lấy lại các roles để có ID
        const roles = await Role.find();
        const roleMap = roles.reduce((acc, role) => {
            acc[role.slug] = role._id;
            return acc;
        }, {});

        // Cập nhật người dùng cũ (migration)
        // Lưu ý: Vì model Customer đã đổi type của role thành ObjectId, 
        // ta dùng lean() hoặc thực hiện query trực tiếp để tránh lỗi cast
        const users = await mongoose.connection.db.collection("customers").find({}).toArray();
        console.log(`Tìm thấy ${users.length} người dùng cần kiểm tra migration.`);

        for (const user of users) {
            let roleId;
            // Nếu role cũ là string "admin" hoặc "teacher", map sang ObjectID
            if (user.role === "admin") {
                roleId = roleMap.admin;
            } else if (user.role === "teacher") {
                roleId = roleMap.teacher;
            } else {
                roleId = roleMap.customer;
            }

            await mongoose.connection.db.collection("customers").updateOne(
                { _id: user._id },
                { $set: { role: roleId } }
            );
        }

        console.log("Đã hoàn thành migration vai trò cho người dùng.");
        process.exit(0);
    } catch (error) {
        console.error("Lỗi khi seed roles:", error);
        process.exit(1);
    }
};

seedRoles();
