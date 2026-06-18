import React, { useState } from "react";
import {
  Table,
  Typography,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import useQuery from "@/hooks/useQuery";
import { roleAdminService } from "@/services/adminServices/roleAdminService";
import { formatDate } from "@/utils/format";

const { Title, Text } = Typography;
const { TextArea } = Input;

const SLUG_COLORS = {
  ADMIN: "#ef4444",
  TEACHER: "#8b5cf6",
  USER: "#10b981",
};

const RolePageAdmin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();

  const {
    data: rolesData,
    loading,
    refetch,
  } = useQuery(roleAdminService.getAllRoles);
  const roles = rolesData || [];

  const showModal = (role = null) => {
    setEditingRole(role);
    if (role) {
      form.setFieldsValue({
        name: role.name,
        slug: role.slug,
        description: role.description,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRole(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      if (editingRole) {
        await roleAdminService.updateRole(editingRole.id, values);
        message.success("Cập nhật vai trò thành công!");
      } else {
        await roleAdminService.createRole(values);
        message.success("Tạo vai trò mới thành công!");
      }
      handleCancel();
      refetch();
    } catch (error) {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await roleAdminService.deleteRole(id);
      message.success("Xóa vai trò thành công!");
      refetch();
    } catch (error) {
      message.error(error?.response?.data?.message || "Không thể xóa vai trò!");
    }
  };

  const columns = [
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: `${SLUG_COLORS[record.slug] || "#64748b"}20`,
              color: SLUG_COLORS[record.slug] || "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <KeyOutlined style={{ fontSize: "16px" }} />
          </div>
          <div>
            <div
              style={{ fontWeight: 600, color: "#0f172a", fontSize: "13.5px" }}
            >
              {name}
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              {record.description || "Không có mô tả"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug) => {
        const color = SLUG_COLORS[slug] || "#64748b";
        return (
          <Tag
            style={{
              background: `${color}15`,
              color: color,
              border: `1px solid ${color}40`,
              borderRadius: "20px",
              padding: "2px 10px",
              fontWeight: 700,
              fontSize: "11px",
              fontFamily: "monospace",
            }}
          >
            {slug}
          </Tag>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (desc) => (
        <Text style={{ color: "#64748b", fontSize: "13px" }}>
          {desc || (
            <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>
              Chưa có mô tả
            </span>
          )}
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span style={{ color: "#64748b", fontSize: "12px" }}>
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            ghost
            onClick={() => showModal(record)}
            style={{ borderRadius: "6px" }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa vai trò này?"
            description="Hành động này không thể hoàn tác. Các tài khoản đang dùng vai trò này có thể bị ảnh hưởng."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              style={{ borderRadius: "6px" }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="admin-page-container"
      style={{
        background: "#f8fafc",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <style>{`
                .role-table .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    font-weight: 600 !important;
                    color: #475569 !important;
                }
                .role-table .ant-table-row:hover > td {
                    background: #f0f9ff !important;
                }
                .role-card {
                    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                }
            `}</style>

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}
          >
            <SafetyCertificateOutlined
              style={{ marginRight: "10px", color: "#4f46e5" }}
            />
            Quản lý Vai trò
          </Title>
          <Text style={{ color: "#64748b" }}>
            Tạo và quản lý các vai trò (Roles) trong hệ thống phân quyền.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          style={{
            background: "#4f46e5",
            borderColor: "#4f46e5",
            borderRadius: "8px",
            fontWeight: 500,
            height: "38px",
          }}
        >
          Thêm vai trò mới
        </Button>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {(roles || []).map((role) => (
          <div
            key={role.id}
            style={{
              flex: 1,
              minWidth: "180px",
              background: "#fff",
              border: `1px solid ${SLUG_COLORS[role.slug] || "#e2e8f0"}40`,
              borderLeft: `4px solid ${SLUG_COLORS[role.slug] || "#e2e8f0"}`,
              borderRadius: "12px",
              padding: "16px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{ fontSize: "13px", fontWeight: 500, color: "#64748b" }}
            >
              {role.name}
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
                marginTop: "4px",
              }}
            >
              <Tag
                style={{
                  background: `${SLUG_COLORS[role.slug] || "#64748b"}15`,
                  color: SLUG_COLORS[role.slug] || "#64748b",
                  border: "none",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                {role.slug}
              </Tag>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="role-card"
        style={{ background: "#fff", padding: "0", overflow: "hidden" }}
      >
        <div
          style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}
        >
          <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "15px" }}>
            Danh sách vai trò ({roles?.length || 0})
          </span>
        </div>
        <Table
          className="role-table"
          columns={columns}
          dataSource={roles || []}
          rowKey={(record) => record.id || record._id}
          loading={loading}
          scroll={{ x: true }}
          pagination={false}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <KeyOutlined style={{ color: "#4f46e5" }} />
            <span>{editingRole ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "16px" }}
        >
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[{ required: true, message: "Vui lòng nhập tên vai trò!" }]}
          >
            <Input placeholder="Ví dụ: Administrator, Teacher..." />
          </Form.Item>

          <Form.Item
            name="slug"
            label={
              <span>
                Slug (mã định danh){" "}
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  (VIẾT HOA, không dấu)
                </Text>
              </span>
            }
            rules={[
              { required: true, message: "Vui lòng nhập slug!" },
              {
                pattern: /^[A-Z_]+$/,
                message:
                  "Slug phải là CHỮ HOA và dấu gạch dưới (VD: ADMIN, SUPER_ADMIN)",
              },
            ]}
          >
            <Input
              placeholder="Ví dụ: ADMIN, TEACHER, USER..."
              style={{ fontFamily: "monospace", fontWeight: 600 }}
              onChange={(e) => {
                form.setFieldsValue({
                  slug: e.target.value.toUpperCase().replace(/\s+/g, "_"),
                });
              }}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea
              rows={3}
              placeholder="Mô tả quyền hạn của vai trò này..."
            />
          </Form.Item>

          <Form.Item
            style={{ textAlign: "right", marginBottom: 0, marginTop: "8px" }}
          >
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: "#4f46e5", borderColor: "#4f46e5" }}
              >
                {editingRole ? "Cập nhật" : "Tạo vai trò"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolePageAdmin;
