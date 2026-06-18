import prisma from "../../config/prisma.js";

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

    const where: any = {};

    if (status) {
        if (status === "all") {
            // No status filter
        } else if (status.includes(",")) {
            where.status = { in: status.split(",") };
        } else {
            where.status = status;
        }
    } else {
        where.status = "active";
    }

    if (level) {
        where.level = level;
    }

    if (search) {
        where.title = { contains: search, mode: "insensitive" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort) {
        const field = sort.startsWith("-") ? sort.substring(1) : sort;
        const direction = sort.startsWith("-") ? "desc" : "asc";
        orderBy = { [field]: direction };
    }

    const [courses, total] = await Promise.all([
        prisma.course.findMany({
            where,
            orderBy,
            skip,
            take,
            include: {
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                }
            }
        }),
        prisma.course.count({ where })
    ]);

    const mappedCourses = courses.map(course => ({
        ...course,
        _id: course.id,
        instructor: course.instructor ? { ...course.instructor, _id: course.instructor.id } : null,
    }));

    return {
        courses: mappedCourses,
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
    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            instructor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    introduce: true,
                    facebookUrl: true,
                    website: true,
                }
            }
        }
    });

    if (!course) {
        throw { message: "Không tìm thấy khóa học.", statusCode: 404 };
    }

    return {
        ...course,
        _id: course.id,
        instructor: course.instructor ? {
            ...course.instructor,
            _id: course.instructor.id,
            facebookURL: course.instructor.facebookUrl, // map back for compatibility
        } : null
    };
};

/**
 * Lấy chi tiết khóa học theo ID
 */
export const getCourseById = async (id: string) => {
    const course = await prisma.course.findUnique({
        where: { id }
    });
    if (!course) {
        throw { message: "Không tìm thấy khóa học.", statusCode: 404 };
    }
    return {
        ...course,
        _id: course.id,
    };
};
