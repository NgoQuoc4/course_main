import prisma from "../../config/prisma.js";

/**
 * Tạo khóa học mới (Admin Only)
 */
export const createCourse = async (courseData: any) => {
    const { instructor, startDate, ...rest } = courseData;
    return await prisma.course.create({
        data: {
            ...rest,
            startDate: startDate ? new Date(startDate) : null,
            instructorId: instructor,
        }
    });
};

/**
 * Cập nhật thông tin khóa học (Admin Only)
 */
export const updateCourse = async (id: string, updateData: any) => {
    const { instructor, startDate, ...rest } = updateData;
    const data: any = { ...rest };
    if (instructor) {
        data.instructorId = instructor;
    }
    if (startDate !== undefined) {
        data.startDate = startDate ? new Date(startDate) : null;
    }
    return await prisma.course.update({
        where: { id },
        data,
    });
};

/**
 * Xóa khóa học (Admin Only)
 */
export const deleteCourse = async (id: string) => {
    return await prisma.course.delete({
        where: { id },
    });
};
