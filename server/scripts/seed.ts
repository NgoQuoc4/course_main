import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import prisma from "../config/prisma.js";
import { Status, Level, RoleType } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedData = async () => {
  try {
    console.log("🔌 Đang kết nối cơ sở dữ liệu qua Prisma...");
    await prisma.$connect();
    console.log("✅ Đã kết nối cơ sở dữ liệu thành công.");

    // Xóa toàn bộ dữ liệu cũ
    console.log("🗑️  Đang xóa dữ liệu cũ để làm mới...");
    await prisma.order.deleteMany({});
    await prisma.blog.deleteMany({});
    await prisma.blogCategory.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.permission.deleteMany({});
    await prisma.gallery.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.subscribe.deleteMany({});
    console.log("✅ Đã xóa toàn bộ dữ liệu cũ.");

    // ========== 0. SEED ROLES ==========
    console.log("🔑 Đang tạo các vai trò...");
    const adminRole = await prisma.role.create({
      data: {
        name: "Administrator",
        slug: RoleType.ADMIN,
        description: "Toàn quyền quản trị hệ thống",
      },
    });

    const teacherRole = await prisma.role.create({
      data: {
        name: "Teacher",
        slug: RoleType.TEACHER,
        description: "Giảng viên có quyền quản lý khóa học và viết bài",
      },
    });

    const userRole = await prisma.role.create({
      data: {
        name: "Customer",
        slug: RoleType.USER,
        description: "Khách hàng/Học viên",
      },
    });

    // ========== 1. SEED ADMIN & CUSTOMERS ==========
    console.log("👤 Đang tạo tài khoản người dùng...");
    const adminPassword = await bcrypt.hash("Admin@123456", 12);
    const userPassword = await bcrypt.hash("Customer@123456", 12);

    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "CFD",
        email: "admin@cfdcourse.vn",
        password: adminPassword,
        roleId: adminRole.id,
        avatar: "img/avatar.jpg",
      },
    });

    const instructor1 = await prisma.user.create({
      data: {
        firstName: "Nguyễn Văn",
        lastName: "Hùng",
        email: "hung@cfdcourse.vn",
        password: adminPassword,
        roleId: teacherRole.id,
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop",
        introduce: "Senior Fullstack Developer với hơn 10 năm kinh nghiệm.",
      },
    });

    const instructor2 = await prisma.user.create({
      data: {
        firstName: "Trần Thị",
        lastName: "Mai",
        email: "mai@cfdcourse.vn",
        password: adminPassword,
        roleId: teacherRole.id,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop",
        introduce: "Chuyên gia UI/UX Design và Frontend chuyên nghiệp.",
      },
    });

    await prisma.user.create({
      data: {
        firstName: "Nguyễn Văn",
        lastName: "An",
        email: "user@cfdcourse.vn",
        password: userPassword,
        roleId: userRole.id,
      },
    });

    // ========== 2. SEED COURSES ==========
    console.log("📚 Đang tạo khóa học mẫu...");

    await prisma.course.create({
      data: {
        title: "ReactJS - Xây Dựng Ứng Dụng Web Hiện Đại",
        slug: slugify("ReactJS - Xây Dựng Ứng Dụng Web Hiện Đại", { lower: true, locale: "vi" }),
        shortDescription: "Làm chủ ReactJS từ cơ bản đến chuyên sâu với kiến trúc Feature-based.",
        description: "Khóa học tập trung vào việc xây dựng các ứng dụng web thực tế, hiểu sâu về Hooks, Redux Toolkit, và cách tổ chức code chuyên nghiệp.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339617/6c4e14b5-73c4-4445-9d40-e86d3fae4254_oyzud9.jpg",
        price: 2500000,
        salePrice: 1990000,
        level: Level.intermediate,
        status: Status.active,
        instructorId: instructor1.id,
        tags: ["ReactJS", "Frontend", "JavaScript"],
        chapters: [
          {
            title: "Cơ bản về React",
            lessons: [
              {
                title: "Giới thiệu React & JSX",
                duration: "15:00",
                isPreview: true,
                content: "",
              },
              {
                title: "Props và State",
                duration: "25:00",
                isPreview: false,
                content: "",
              },
            ],
          },
        ],
        requirements: ["Đã học qua Javascript cơ bản", "Biết sử dụng HTML/CSS"],
        outcomes: ["Tự xây dựng ứng dụng React hoàn chỉnh", "Hiểu sâu về React Hook và State Management"],
      },
    });

    await prisma.course.create({
      data: {
        title: "Node.js & Express - Làm Chủ Backend API",
        slug: slugify("Node.js & Express - Làm Chủ Backend API", { lower: true, locale: "vi" }),
        shortDescription: "Xây dựng RESTful API chuẩn công nghiệp với Node.js, Express và MongoDB.",
        description: "Học cách thiết kế hệ thống backend mở rộng, bảo mật JWT, và triển khai lên môi trường vps chuyên nghiệp.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339727/a1115d0a-6384-4362-baa6-98f5e22d8049_cltxae.jpg",
        price: 2200000,
        salePrice: 0,
        level: Level.advanced,
        status: Status.active,
        instructorId: instructor1.id,
        tags: ["NodeJS", "Backend", "MongoDB"],
        chapters: [],
        requirements: ["Đã nắm vững ES6+", "Hiểu cơ bản về Client-Server model"],
        outcomes: ["Xây dựng backend RESTful API chuẩn xác", "Sử dụng Prisma ORM và làm chủ bảo mật JWT"],
      },
    });

    await prisma.course.create({
      data: {
        title: "HTML/CSS & Web Responsive (Thực Chiến)",
        slug: slugify("HTML/CSS & Web Responsive (Thực Chiến)", { lower: true, locale: "vi" }),
        shortDescription: "Từ người mới bắt đầu đến khi xây dựng được giao diện web chuyên nghiệp tự thích ứng.",
        description: "Học cách sử dụng HTML5, CSS3, Flexbox, Grid và các kỹ thuật Responsive hiện đại nhất.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339508/41be9b02-25f2-4178-8873-31b7213efb42_zgljbs.jpg",
        price: 1500000,
        salePrice: 990000,
        level: Level.beginner,
        status: Status.active,
        instructorId: admin.id,
        tags: ["HTML", "CSS", "Responsive"],
        chapters: [],
        requirements: ["Sử dụng máy tính cơ bản"],
        outcomes: ["Cắt PSD/Figma sang HTML/CSS chuẩn pixel", "Làm chủ các kĩ thuật dàn trang responsive"],
      },
    });

    await prisma.course.create({
      data: {
        title: "UI/UX Design - Thiết Kế Trải Nghiệm Người Dùng",
        slug: slugify("UI/UX Design - Thiết Kế Trải Nghiệm Người Dùng", { lower: true, locale: "vi" }),
        shortDescription: "Học cách tư duy và thiết kế ứng dụng web/mobile đẹp mắt với Figma.",
        description: "Hiểu sâu về tâm lý người dùng, quy trình thiết kế từ Wireframe đến Prototype hoàn chỉnh.",
        thumbnail: "https://res.cloudinary.com/dguad3xyf/image/upload/v1776339461/e9408b86-bc98-4d28-a651-61b21ffb4d07_v1cnjd.jpg",
        price: 3000000,
        salePrice: 2500000,
        level: Level.beginner,
        status: Status.active,
        instructorId: instructor2.id,
        tags: ["Design", "UIUX", "Figma"],
        chapters: [],
        requirements: ["Đam mê lĩnh vực thiết kế"],
        outcomes: ["Thiết kế UI chuyên nghiệp trên Figma", "Có tư duy phân tích trải nghiệm người dùng chuẩn"],
      },
    });

    // ========== 3. SEED BLOG CATEGORIES & BLOGS ==========
    console.log("📂 Đang tạo danh mục blog & bài viết...");
    const cat1 = await prisma.blogCategory.create({
      data: { name: "Kiến Thức Lập Trình", slug: "kien-thuc-lap-trinh" }
    });
    const cat2 = await prisma.blogCategory.create({
      data: { name: "Công Nghệ Mới", slug: "cong-nghe-moi" }
    });
    await prisma.blogCategory.create({
      data: { name: "Review Khóa Học", slug: "review-khoa-hoc" }
    });

    await prisma.blog.create({
      data: {
        title: "Lộ trình học Frontend Developer từ Zero đến Hero",
        slug: "lo-trinh-hoc-frontend-developer",
        excerpt: "Để trở thành một Frontend Developer chuyên nghiệp, bạn cần học những gì?",
        content: "<p>Bài viết chia sẻ chi tiết về các công nghệ cần nắm...</p>",
        thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&h=500&fit=crop",
        categoryId: cat1.id,
        authorId: instructor1.id,
        status: "published",
        viewCount: 0,
        tags: ["Frontend", "Lộ trình"],
      },
    });

    await prisma.blog.create({
      data: {
        title: "Vì sao ReactJS vẫn là 'Vua' trong năm 2025?",
        slug: "vi-sao-reactjs-van-la-vua",
        excerpt: "Mặc dù có nhiều đối thủ, React vẫn giữ vững ngôi vương.",
        content: "<p>Phân tích các ưu điểm vượt trội của ReactJS...</p>",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&h=500&fit=crop",
        categoryId: cat2.id,
        authorId: instructor2.id,
        status: "published",
        viewCount: 0,
        tags: ["ReactJS", "Công nghệ"],
      },
    });

    // ========== 4. SEED GALLERY ==========
    console.log("🖼️  Đang tạo ảnh Gallery...");
    await prisma.gallery.createMany({
      data: [
        {
          title: "Lớp học thực tế 01",
          imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800",
          category: "classroom",
          order: 1,
          isActive: true,
        },
        {
          title: "Workshop tháng 5",
          imageUrl: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=800",
          category: "event",
          order: 2,
          isActive: true,
        },
        {
          title: "Hoạt động Teambuilding",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800",
          category: "event",
          order: 3,
          isActive: true,
        },
        {
          title: "Lớp UI/UX Design",
          imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
          category: "classroom",
          order: 4,
          isActive: true,
        },
      ]
    });

    // ========== 5. SEED TEAMS ==========
    console.log("👥 Đang tạo thông tin đội ngũ...");
    await prisma.team.createMany({
      data: [
        {
          name: "Nguyễn Văn Hùng",
          position: "Founder & Lead Dev",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300",
          order: 1,
          isActive: true,
        },
        {
          name: "Trần Thị Mai",
          position: "Design Lead",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300",
          order: 2,
          isActive: true,
        },
        {
          name: "Lê Văn Phúc",
          position: "Fullstack Developer",
          avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300",
          order: 3,
          isActive: true,
        },
      ]
    });

    // ========== 6. SEED QUESTIONS ==========
    console.log("❓ Đang tạo câu hỏi FAQ...");
    await prisma.question.createMany({
      data: [
        {
          question: "Khóa học dành cho ai?",
          answer: "CFD Course dành cho tất cả mọi người có đam mê với lập trình, từ người mới bắt đầu đến người đã có kinh nghiệm.",
          order: 1,
          isActive: true,
          category: "general",
        },
        {
          question: "Cần chuẩn bị gì trước khi học?",
          answer: "Bạn chỉ cần một chiếc laptop và niềm đam mê, chúng mình sẽ lo phần còn lại.",
          order: 2,
          isActive: true,
          category: "general",
        },
        {
          question: "Sau khóa học có hỗ trợ việc làm không?",
          answer: "CFD hỗ trợ review CV, kết nối thực tập và giới thiệu đến các đối tác uy tín.",
          order: 3,
          isActive: true,
          category: "general",
        },
      ]
    });

    console.log("\n========================================");
    console.log("🎉 SEED DỮ LIỆU HOÀN TẤT!");
    console.log("📧 Admin: admin@cfdcourse.vn | Admin@123456");
    console.log("📧 User: user@cfdcourse.vn | Customer@123456");
    console.log("========================================\n");
  } catch (error: any) {
    console.error("❌ Lỗi khi seed dữ liệu:", error.message);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Đã ngắt kết nối với MongoDB.");
  }
};

seedData();
