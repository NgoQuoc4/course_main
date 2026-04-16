// src/services/courseService.js
// Tầng Business Logic cho Courses (Khóa học)

const Course = require("../models/Course");

/**
 * Lấy danh sách khóa học với filter, sort, pagination
 */
const getCourses = async (query) => {
    const {
        search,
        status = "active",
        level,
        page = 1,
        limit = 9,
        sort = "-createdAt",
    } = query;

    // Xây dựng điều kiện lọc
    const filter = { status };

    if (level) {
        filter.level = level;
    }

    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
        .select("-chapters")
        .populate("instructor", "firstName lastName avatar")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

    return {
        courses,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

/**
 * Lấy chi tiết khóa học theo slug
 */
const getCourseBySlug = async (slug) => {
    const course = await Course.findOne({ slug }).populate(
        "instructor",
        "firstName lastName avatar introduce facebookURL website"
    );

    if (!course) {
        const error = new Error("Không tìm thấy khóa học.");
        error.statusCode = 404;
        throw error;
    }

    return course;
};

/**
 * Lấy chi tiết khóa học theo ID
 */
const getCourseById = async (id) => {
    const course = await Course.findById(id);
    if (!course) {
        const error = new Error("Không tìm thấy khóa học.");
        error.statusCode = 404;
        throw error;
    }
    return course;
};

/**
 * Tạo khóa học mới (Admin Only)
 */
const createCourse = async (courseData) => {
    return await Course.create(courseData);
};

/**
 * Cập nhật thông tin khóa học (Admin Only)
 */
const updateCourse = async (id, updateData) => {
    const course = await Course.findById(id);

    if (!course) {
        const error = new Error("Không tìm thấy khóa học để cập nhật.");
        error.statusCode = 404;
        throw error;
    }

    // Cập nhật các trường
    Object.keys(updateData).forEach((key) => {
        course[key] = updateData[key];
    });

    await course.save();
    return course;
};

/**
 * Xóa khóa học (Admin Only)
 */
const deleteCourse = async (id) => {
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
        const error = new Error("Không tìm thấy khóa học để xóa.");
        error.statusCode = 404;
        throw error;
    }

    return course;
};

module.exports = {
    getCourses,
    getCourseBySlug,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};

