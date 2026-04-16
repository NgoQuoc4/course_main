import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import slugify from "slugify";

// Import các models
import Customer from "../models/Customer.js";
import Course from "../models/Course.js";
import BlogCategory from "../models/BlogCategory.js";
import Blog from "../models/Blog.js";
import Gallery from "../models/Gallery.js";
import Team from "../models/Team.js";
import Question from "../models/Question.js";
import Subscribe from "../models/Subscribe.js";
import Role from "../models/Role.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Đã kết nối MongoDB để seed dữ liệu...");
  } catch (error: any) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Xóa toàn bộ dữ liệu cũ
    console.log("🗑️  Đang xóa dữ liệu cũ để làm mới...");
    await Promise.all([
      Customer.deleteMany({}),
      Course.deleteMany({}),
      BlogCategory.deleteMany({}),
      Blog.deleteMany({}),
      Gallery.deleteMany({}),
      Team.deleteMany({}),
      Question.deleteMany({}),
      Subscribe.deleteMany({}),
      Role.deleteMany({}),
    ]);

    // ========== 0. SEED ROLES ==========
    console.log("🔑 Đang tạo các vai trò...");
    const roles = await Role.insertMany([
      { name: "Administrator", slug: "admin", description: "Toàn quyền quản trị hệ thống" },
      { name: "Teacher", slug: "teacher", description: "Giảng viên có quyền quản lý khóa học và viết bài" },
      { name: "Customer", slug: "customer", description: "Khách hàng/Học viên" },
    ]);

    const roleMap: any = roles.reduce((acc: any, role: any) => {
      acc[role.slug] = role._id;
      return acc;
    }, {});

    // ========== 1. SEED ADMIN & CUSTOMERS ==========
    console.log("👤 Đang tạo tài khoản người dùng...");
    const adminPassword = await bcrypt.hash("Admin@123456", 12);
    const userPassword = await bcrypt.hash("Customer@123456", 12);

    const admin = await Customer.create({
      firstName: "Admin",
      lastName: "CFD",
      email: "admin@cfdcourse.vn",
      password: adminPassword,
      role: roleMap.admin,
      avatar: "img/avatar.jpg",
    });

    const instructors = await Customer.insertMany([
      {
        firstName: "Nguyễn Văn",
        lastName: "Hùng",
        email: "hung@cfdcourse.vn",
        password: adminPassword,
        role: roleMap.teacher,
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop",
        introduce: "Senior Fullstack Developer với hơn 10 năm kinh nghiệm.",
      },
      {
        firstName: "Trần Thị",
        lastName: "Mai",
        email: "mai@cfdcourse.vn",
        password: adminPassword,
        role: roleMap.teacher,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop",
        introduce: "Chuyên gia UI/UX Design và Frontend chuyên nghiệp.",
      },
    ]);

    await Customer.create({
      firstName: "Nguyễn Văn",
      lastName: "An",
      email: "user@cfdcourse.vn",
      password: userPassword,
      role: roleMap.customer,
    });

    // ========== 2. SEED COURSES ==========
    console.log("📚 Đang tạo khóa học mẫu...");
    const coursesBatch = [
      {
        title: "ReactJS - Xây Dựng Ứng Dụng Web Hiện Đại",
        shortDescription: "Làm chủ ReactJS từ cơ bản đến chuyên sâu với kiến trúc Feature-based.",
        description: "Khóa học tập trung vào việc xây dựng các ứng dụng web thực tế, hiểu sâu về Hooks, Redux Toolkit, và cách tổ chức code chuyên nghiệp.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339617/6c4e14b5-73c4-4445-9d40-e86d3fae4254_oyzud9.jpg",
        price: 2500000,
        salePrice: 1990000,
        level: "intermediate",
        instructor: instructors[0]._id,
        tags: ["ReactJS", "Frontend", "JavaScript"],
        chapters: [
          {
            title: "Cơ bản về React",
            lessons: [
              { title: "Giới thiệu React & JSX", duration: "15:00", isPreview: true },
              { title: "Props và State", duration: "25:00" },
            ],
          },
        ],
      },
      {
        title: "Node.js & Express - Làm Chủ Backend API",
        shortDescription: "Xây dựng RESTful API chuẩn công nghiệp với Node.js, Express và MongoDB.",
        description: "Học cách thiết kế hệ thống backend mở rộng, bảo mật JWT, và triển khai lên môi trường vps chuyên nghiệp.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339727/a1115d0a-6384-4362-baa6-98f5e22d8049_cltxae.jpg",
        price: 2200000,
        salePrice: 0,
        level: "advanced",
        instructor: instructors[0]._id,
        tags: ["NodeJS", "Backend", "MongoDB"],
      },
      {
        title: "HTML/CSS & Web Responsive (Thực Chiến)",
        shortDescription: "Từ người mới bắt đầu đến khi xây dựng được giao diện web chuyên nghiệp tự thích ứng.",
        description: "Học cách sử dụng HTML5, CSS3, Flexbox, Grid và các kỹ thuật Responsive hiện đại nhất.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339508/41be9b02-25f2-4178-8873-31b7213efb42_zgljbs.jpg",
        price: 1500000,
        salePrice: 990000,
        level: "beginner",
        instructor: admin._id,
        tags: ["HTML", "CSS", "Responsive"],
      },
      {
        title: "UI/UX Design - Thiết Kế Trải Nghiệm Người Dùng",
        shortDescription: "Học cách tư duy và thiết kế ứng dụng web/mobile đẹp mắt với Figma.",
        description: "Hiểu sâu về tâm lý người dùng, quy trình thiết kế từ Wireframe đến Prototype hoàn chỉnh.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339461/e9408b86-bc98-4d28-a651-61b21ffb4d07_v1cnjd.jpg",
        price: 3000000,
        salePrice: 2500000,
        level: "beginner",
        instructor: instructors[1]._id,
        tags: ["Design", "UIUX", "Figma"],
      },
    ];

    const coursesBatchWithSlugs = coursesBatch.map((course: any) => ({
      ...course,
      slug: slugify(course.title, { lower: true, locale: "vi" }),
    }));

    await Course.insertMany(coursesBatchWithSlugs);

    // ========== 3. SEED BLOG CATEGORIES & BLOGS ==========
    console.log("📂 Đang tạo danh mục blog & bài viết...");
    const blogCategories = await BlogCategory.insertMany([
      { name: "Kiến Thức Lập Trình", slug: "kien-thuc-lap-trinh" },
      { name: "Công Nghệ Mới", slug: "cong-nghe-moi" },
      { name: "Review Khóa Học", slug: "review-khoa-hoc" },
    ]);

    await Blog.insertMany([
      {
        title: "Lộ trình học Frontend Developer từ Zero đến Hero",
        slug: "lo-trinh-hoc-frontend-developer",
        excerpt: "Để trở thành một Frontend Developer chuyên nghiệp, bạn cần học những gì?",
        content: "<p>Bài viết chia sẻ chi tiết về các công nghệ cần nắm...</p>",
        thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&h=500&fit=crop",
        category: blogCategories[0]._id,
        author: instructors[0]._id,
        status: "published",
      },
      {
        title: "Vì sao ReactJS vẫn là 'Vua' trong năm 2025?",
        slug: "vi-sao-reactjs-van-la-vua",
        excerpt: "Mặc dù có nhiều đối thủ, React vẫn giữ vững ngôi vương.",
        content: "<p>Phân tích các ưu điểm vượt trội của ReactJS...</p>",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&h=500&fit=crop",
        category: blogCategories[1]._id,
        author: instructors[1]._id,
        status: "published",
      },
    ]);

    // ========== 4. SEED GALLERY ==========
    console.log("🖼️  Đang tạo ảnh Gallery...");
    await Gallery.insertMany([
      { title: "Lớp học thực tế 01", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800", category: "classroom", order: 1, isActive: true },
      { title: "Workshop tháng 5", imageUrl: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=800", category: "event", order: 2, isActive: true },
      { title: "Hoạt động Teambuilding", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800", category: "event", order: 3, isActive: true },
      { title: "Lớp UI/UX Design", imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800", category: "classroom", order: 4, isActive: true },
    ]);

    // ========== 5. SEED TEAMS ==========
    console.log("👥 Đang tạo thông tin đội ngũ...");
    await Team.insertMany([
      { name: "Nguyễn Văn Hùng", position: "Founder & Lead Dev", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300", order: 1, isActive: true },
      { name: "Trần Thị Mai", position: "Design Lead", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300", order: 2, isActive: true },
      { name: "Lê Văn Phúc", position: "Fullstack Developer", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300", order: 3, isActive: true },
    ]);

    // ========== 6. SEED QUESTIONS ==========
    console.log("❓ Đang tạo câu hỏi FAQ...");
    await Question.insertMany([
      { question: "Khóa học dành cho ai?", answer: "CFD Course dành cho tất cả mọi người có đam mê với lập trình, từ người mới bắt đầu đến người đã có kinh nghiệm.", order: 1, isActive: true, category: "general" },
      { question: "Cần chuẩn bị gì trước khi học?", answer: "Bạn chỉ cần một chiếc laptop và niềm đam mê, chúng mình sẽ lo phần còn lại.", order: 2, isActive: true, category: "general" },
      { question: "Sau khóa học có hỗ trợ việc làm không?", answer: "CFD hỗ trợ review CV, kết nối thực tập và giới thiệu đến các đối tác uy tín.", order: 3, isActive: true, category: "general" },
    ]);

    console.log("\n========================================");
    console.log("🎉 SEED DỮ LIỆU HOÀN TẤT!");
    console.log("📧 Admin: admin@cfdcourse.vn | Admin@123456");
    console.log("📧 User: user@cfdcourse.vn | Customer@123456");
    console.log("========================================\n");

  } catch (error: any) {
    console.error("❌ Lỗi khi seed dữ liệu:", error.message);
  } finally {
    mongoose.disconnect();
    console.log("🔌 Đã ngắt kết nối với MongoDB.");
  }
};

seedData();
