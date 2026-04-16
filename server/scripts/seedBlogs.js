const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const BlogCategory = require("../models/BlogCategory");
const Blog = require("../models/Blog");
const Role = require("../models/Role");
const slugify = require("slugify");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Đã kết nối MongoDB để seed bài viết...");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error.message);
        process.exit(1);
    }
};

const seedBlogs = async () => {
    try {
        await connectDB();

        // 1. Tìm Author (Admin hoặc Teacher)
        const authors = await Customer.find({}).populate('role');
        const validAuthors = authors.filter(a => ['admin', 'teacher'].includes(a.role?.slug));

        if (validAuthors.length === 0) {
            console.error("❌ Không tìm thấy user nào có quyền admin/teacher để gán làm tác giả.");
            process.exit(1);
        }

        // 2. Xóa dữ liệu cũ của blog
        console.log("🗑️  Đang xóa danh mục và bài viết cũ...");
        await BlogCategory.deleteMany({});
        await Blog.deleteMany({});

        // 3. Tạo danh mục
        console.log("📂 Đang tạo danh mục mới...");
        const categories = await BlogCategory.insertMany([
            { name: "Kiến Thức Lập Trình", slug: "kien-thuc-lap-trinh", description: "Chia sẻ kinh nghiệm, tutorial về code" },
            { name: "Thiết Kế UI/UX", slug: "thiet-ke-ui-ux", description: "Tư duy thiết kế và sử dụng công cụ Figma" },
            { name: "Kỹ Năng Mềm", slug: "ky-nang-mem", description: "Kỹ năng làm việc tại các công ty công nghệ" },
            { name: "Sự Kiện & Tin Tức", slug: "su-kien-tin-tuc", description: "Hoạt động tại CFD và giới công nghệ" },
            { name: "Công Nghệ Mới", slug: "cong-nghe-moi", description: "Cập nhật AI, Web3 và các xu hướng mới" },
        ]);

        // 4. Tạo bài viết
        console.log("✍️ Đang tạo danh sách bài viết mẫu...");
        const blogData = [
            {
                title: "Lộ trình học Frontend 2025 cho người mới",
                excerpt: "Để trở thành Frontend Developer chuyên nghiệp cần học những gì trong năm nay?",
                category: categories[0]._id,
                thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
            },
            {
                title: "10 lỗi thường gặp của UI Designer mới vào nghề",
                excerpt: "Những sai sót nhỏ có thể làm hỏng trải nghiệm người dùng của bạn.",
                category: categories[1]._id,
                thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800",
            },
            {
                title: "Cách quản lý thời gian hiệu quả cho Developer",
                excerpt: "Làm sao để code nhiều hơn mà không bị cháy túi?",
                category: categories[2]._id,
                thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
            },
            {
                title: "Tổng kết workshop: Build App với Next.js",
                excerpt: "Buổi workshop thu hút hơn 100 học viên tham dự trực tuyến.",
                category: categories[3]._id,
                thumbnail: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=800",
            },
            {
                title: "AI đang thay đổi cách chúng ta viết code như thế nào?",
                excerpt: "Sử dụng Copilot hay Cursor để tăng năng suất gấp đôi.",
                category: categories[4]._id,
                thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
            },
            {
                title: "Mastering CSS Grid trong 15 phút",
                excerpt: "Kỹ thuật dàn trang mạnh mẽ nhất của CSS hiện đại.",
                category: categories[0]._id,
                thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
            },
            {
                title: "Tâm lý học màu sắc trong thiết kế Web",
                excerpt: "Tại sao các ứng dụng tài chính lại thường có màu xanh dương?",
                category: categories[1]._id,
                thumbnail: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800",
            },
            {
                title: "Kêu gọi vốn 101 cho Startup công nghệ",
                excerpt: "Những điều cần chuẩn bị khi Pitching trước nhà đầu tư.",
                category: categories[2]._id,
                thumbnail: "https://images.unsplash.com/photo-1553729459-014266a7e507?w=800",
            },
            {
                title: "CFD Team Building: Hành trình Đà Lạt mộng mơ",
                excerpt: "Những kỷ niệm khó quên trong chuyến đi nghỉ dưỡng vừa qua.",
                category: categories[3]._id,
                thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
            },
            {
                title: "Blockchain không chỉ là Tiền điện tử",
                excerpt: "Ứng dụng của sổ cái phi tập trung vào chuỗi cung ứng.",
                category: categories[4]._id,
                thumbnail: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800",
            },
            {
                title: "Clean Code: Viết mã để 'con người' có thể đọc được",
                excerpt: "Mã chạy được là tốt, mã dễ bảo trì mới là tuyệt vời.",
                category: categories[0]._id,
                thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
            },
            {
                title: "Tại sao Typography là linh hồn của thiết kế?",
                excerpt: "Cách chọn font chữ phù hợp với thương hiệu.",
                category: categories[1]._id,
                thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
            },
            {
                title: "Nâng cao kỹ năng thuyết trình cho Tech-lead",
                excerpt: "Biến các con số khô khan thành câu chuyện hấp dẫn.",
                category: categories[2]._id,
                thumbnail: "https://images.unsplash.com/photo-1475721027785-f74dea327912?w=800",
            },
            {
                title: "Thử thách 30 ngày code liên tục tại CFD",
                excerpt: "Cơ hội nhận học bổng toàn phần cho học viên xuất sắc.",
                category: categories[3]._id,
                thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
            },
            {
                title: "Web3.0 - Tương lai của mạng internet phi tập trung",
                excerpt: "Chúng ta đang đứng trước ngưỡng cửa của một cuộc cách mạng.",
                category: categories[4]._id,
                thumbnail: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800",
            },
        ];

        const finalBlogs = blogData.map((blog, index) => ({
            ...blog,
            slug: slugify(blog.title, { lower: true, locale: "vi" }),
            content: `<h3>${blog.title}</h3><p>Đây là nội dung chi tiết của bài viết số ${index + 1}. CFD Circle là một cộng đồng học tập thực chiến...</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
            author: validAuthors[index % validAuthors.length]._id,
            status: "published",
            tags: ["CFDCircle", "Learning", "Tech"],
        }));

        await Blog.insertMany(finalBlogs);

        console.log("\n========================================");
        console.log("🎉 SEED BLOG DATA HOÀN TẤT!");
        console.log(`- Đã tạo: ${categories.length} danh mục.`);
        console.log(`- Đã tạo: ${finalBlogs.length} bài viết.`);
        console.log("========================================\n");

    } catch (error) {
        console.error("❌ Lỗi khi seed blog:", error.message);
    } finally {
        mongoose.disconnect();
        console.log("🔌 Đã ngắt kết nối với MongoDB.");
    }
};

seedBlogs();
