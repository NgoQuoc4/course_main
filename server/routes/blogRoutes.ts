import { Router } from "express";
import {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../controllers/blogController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

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

export default router;
