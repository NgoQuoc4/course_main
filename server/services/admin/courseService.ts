import prisma from "../../config/prisma.js";

/**
 * Tạo khóa học mới (Admin Only)
 */
export const createCourse = async (courseData: any) => {
    const { instructor, ...rest } = courseData;
    return await prisma.course.create({
        data: {
            ...rest,
            instructorId: instructor,
        }
    });
};

/**
 * Cập nhật thông tin khóa học (Admin Only)
 */
export const updateCourse = async (id: string, updateData: any) => {
    const { instructor, ...rest } = updateData;
    const data: any = { ...rest };
    if (instructor) {
        data.instructorId = instructor;
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
