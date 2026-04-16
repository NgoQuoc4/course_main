// routes/courseRoutes.js
// Khai báo các route liên quan đến khóa học

const express = require("express");
const router = express.Router();
const { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } = require("../controllers/courseController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// GET /courses - Danh sách khóa học (có filter, search, pagination)
// Ví dụ: GET /courses?status=active&search=html&page=1&limit=9
router.get("/", getCourses);

// GET /courses/:slug - Chi tiết khóa học theo slug
// Ví dụ: GET /courses/html-css-basics
router.get("/:slug", getCourseBySlug);

// Các route quản trị bên dưới cần quyền Admin hoặc Teacher
router.use(protect);
router.use(restrictTo("admin", "teacher"));

router.post("/", createCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;

