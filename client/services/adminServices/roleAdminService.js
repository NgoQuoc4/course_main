import axiosClient from "../axiosClient";

export const roleAdminService = {
    // Lấy tất cả roles
    getAllRoles() {
        return axiosClient.get("/admin/roles");
    },
    // Lấy role theo id
    getRoleById(id) {
        return axiosClient.get(`/admin/roles/${id}`);
    },
    // Tạo role mới
    createRole(data) {
        return axiosClient.post("/admin/roles", data);
    },
    // Cập nhật role
    updateRole(id, data) {
        return axiosClient.put(`/admin/roles/${id}`, data);
    },
    // Xóa role
    deleteRole(id) {
        return axiosClient.delete(`/admin/roles/${id}`);
    },
};
