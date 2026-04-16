import { Router } from "express";
import { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } from "../controllers/courseController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// GET /courses - Danh sách khóa học (có filter, search, pagination)
router.get("/", getCourses);

// GET /courses/:slug - Chi tiết khóa học theo slug
router.get("/:slug", getCourseBySlug);

// Các route quản trị bên dưới cần quyền Admin hoặc Teacher
router.use(protect);
router.use(restrictTo("admin", "teacher"));

router.post("/", createCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
