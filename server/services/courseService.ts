import Course from "../models/Course.js";
import { ICourseDocument } from "../models/Course.js";

interface GetCoursesQuery {
    search?: string;
    status?: string;
    level?: string;
    page?: number | string;
    limit?: number | string;
    sort?: string;
}

/**
 * Lấy danh sách khóa học với filter, sort, pagination
 */
export const getCourses = async (query: GetCoursesQuery) => {
    const {
        search,
        status,
        level,
        page = 1,
        limit = 9,
        sort = "-createdAt",
    } = query;

    const filter: any = {};

    if (status) {
        if (status === "all") {
            // No status filter
        } else if (status.includes(",")) {
            filter.status = { $in: status.split(",") };
        } else {
            filter.status = status;
        }
    } else {
        filter.status = "active";
    }

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
export const getCourseBySlug = async (slug: string) => {
    const course = await Course.findOne({ slug }).populate(
        "instructor",
        "firstName lastName avatar introduce facebookURL website"
    );

    if (!course) {
        throw { message: "Không tìm thấy khóa học.", statusCode: 404 };
    }

    return course;
};

/**
 * Lấy chi tiết khóa học theo ID
 */
export const getCourseById = async (id: string) => {
    const course = await Course.findById(id);
    if (!course) {
        throw { message: "Không tìm thấy khóa học.", statusCode: 404 };
    }
    return course;
};

/**
 * Tạo khóa học mới (Admin Only)
 */
export const createCourse = async (courseData: any) => {
    return await Course.create(courseData);
};

/**
 * Cập nhật thông tin khóa học (Admin Only)
 */
export const updateCourse = async (id: string, updateData: any) => {
    const course = await Course.findById(id);

    if (!course) {
        throw { message: "Không tìm thấy khóa học để cập nhật.", statusCode: 404 };
    }

    Object.keys(updateData).forEach((key) => {
        (course as any)[key] = updateData[key];
    });

    await course.save();
    return course;
};

/**
 * Xóa khóa học (Admin Only)
 */
export const deleteCourse = async (id: string) => {
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
        throw { message: "Không tìm thấy khóa học để xóa.", statusCode: 404 };
    }

    return course;
};
