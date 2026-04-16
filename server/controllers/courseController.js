// controllers/courseController.js
// Controller xử lý Courses - LỚP MỎNG gọi Service

const catchAsync = require("../utils/catchAsync");
const courseService = require("../services/courseService");

/**
 * @desc    Lấy danh sách khóa học
 * @route   GET /courses
 * @access  Public
 */
const getCourses = catchAsync(async (req, res) => {
    const coursesData = await courseService.getCourses(req.query);

    res.status(200).json({
        success: true,
        data: coursesData,
    });
});

/**
 * @desc    Lấy chi tiết khóa học theo slug
 * @route   GET /courses/:slug
 * @access  Public
 */
const getCourseBySlug = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const course = await courseService.getCourseBySlug(slug);

    res.status(200).json({
        success: true,
        data: course,
    });
});

/**
 * @desc    Tạo khóa học mới (Admin)
 * @route   POST /courses
 */
const createCourse = catchAsync(async (req, res) => {
    const course = await courseService.createCourse(req.body);

    res.status(201).json({
        success: true,
        message: "Tạo khóa học thành công.",
        data: course,
    });
});

/**
 * @desc    Cập nhật khóa học (Admin)
 * @route   PATCH /courses/:id
 */
const updateCourse = catchAsync(async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "Cập nhật khóa học thành công.",
        data: course,
    });
});

/**
 * @desc    Xóa khóa học (Admin)
 * @route   DELETE /courses/:id
 */
const deleteCourse = catchAsync(async (req, res) => {
    await courseService.deleteCourse(req.params.id);

    res.status(200).json({
        success: true,
        message: "Xóa khóa học thành công.",
    });
});

module.exports = {
    getCourses,
    getCourseBySlug,
    createCourse,
    updateCourse,
    deleteCourse,
};

