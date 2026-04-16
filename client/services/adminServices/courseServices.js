import axiosClient from "../axiosClient";

export const courseServices = {
    // Lấy danh sách khóa học (Dùng chung hoặc có thể mở rộng cho Admin)
    getCourses(query = "") {
        return axiosClient.get(`/courses${query}`);
    },
    // Tạo mới khóa học
    createCourse(data) {
        return axiosClient.post("/courses", data);
    },
    // Cập nhật khóa học
    updateCourse(id, data) {
        return axiosClient.patch(`/courses/${id}`, data);
    },
    // Xóa khóa học
    deleteCourse(id) {
        return axiosClient.delete(`/courses/${id}`);
    },
};
