// routes/blogRoutes.js
// Khai báo các route liên quan đến blog và danh mục blog

const express = require("express");
const router = express.Router();
const {
    getBlogs,
    getBlogBySlug,
    getBlogCategories,
    getBlogCategoryBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// --- Blog Routes ---
// GET /api/blogs - Danh sách bài viết
router.get("/", getBlogs);

// GET /api/blogs/:slug - Chi tiết bài viết
router.get("/:slug", getBlogBySlug);

// --- Admin Section ---
router.use(protect);
router.use(restrictTo("admin", "teacher"));

router.post("/", createBlog);
router.patch("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;

