import axiosClient from "../axiosClient";

export const userAdminService = {
    // Lấy danh sách người dùng
    getUsers(query = "") {
        return axiosClient.get(`/admin/users${query}`);
    },
    // Cập nhật vai trò (phân quyền)
    updateRole(id, role) {
        return axiosClient.patch(`/admin/users/${id}/role`, { role });
    },
    // Xóa người dùng
    deleteUser(id) {
        return axiosClient.delete(`/admin/users/${id}`);
    }
};
