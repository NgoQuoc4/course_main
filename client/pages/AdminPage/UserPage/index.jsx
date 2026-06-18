import { useState } from "react";
import {
  Table,
  Typography,
  Tag,
  Select,
  Space,
  Button,
  Popconfirm,
  message,
  Input,
  Avatar,
} from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import useQuery from "@/hooks/useQuery";
import { userAdminService } from "@/services/adminServices/userAdminService";
import { roleAdminService } from "@/services/adminServices/roleAdminService";
import { formatDate } from "@/utils/format";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// Màu sắc theo slug role
const ROLE_COLORS = {
  ADMIN: { bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
  TEACHER: { bg: "rgba(139,92,246,0.1)", color: "#7c3aed" },
  USER: { bg: "rgba(16,185,129,0.1)", color: "#059669" },
};

const UserPageAdmin = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(undefined);

  // Fetch danh sách users
  const {
    data: usersData,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["users", search, roleFilter],
    queryFn: async () => {
      const query = `?search=${search}${roleFilter ? `&role=${roleFilter}` : ""}`;
      return userAdminService.getUsers(query);
    },
  });

  // Fetch danh sách roles động từ API
  const { data: rolesData, isLoading: roleLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => roleAdminService.getAllRoles(),
  });

  const users = usersData?.users || [];
  const pagination = usersData?.pagination || {};
  const roles = rolesData || [];

  const handleRoleChange = async (userId, newRoleSlug) => {
    try {
      await userAdminService.updateRole(userId, newRoleSlug);
      message.success("Cập nhật vai trò thành công!");
      refetch();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Không thể cập nhật vai trò!",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await userAdminService.deleteUser(id);
      message.success("Xóa người dùng thành công!");
      refetch();
    } catch (err) {
      message.error("Không thể xóa người dùng!");
    }
  };

  //   const isAdmin = (record) => {
  //     const slug = record.role?.slug || "";
  //     return slug.toUpperCase() === "ADMIN";
  //   };

  const columns = [
    {
      title: "Họ tên",
      key: "name",
      render: (_, record) => {
        const name = `${record.firstName} ${record.lastName}`;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar
              src={record.avatar}
              icon={!record.avatar && <UserOutlined />}
              style={{
                background: record.avatar ? undefined : "#e0e7ff",
                color: "#4f46e5",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#0f172a",
                  fontSize: "13.5px",
                }}
              >
                {name}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                {record.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (p) => (
        <Text style={{ color: p ? "#475569" : "#cbd5e1", fontSize: "13px" }}>
          {p || "Chưa cập nhật"}
        </Text>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role, record) => {
        const slug = role?.slug || "";
        const theme = ROLE_COLORS[slug.toUpperCase()] || {
          bg: "#f1f5f9",
          color: "#64748b",
        };
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Tag
              style={{
                background: theme.bg,
                color: theme.color,
                border: "none",
                borderRadius: "20px",
                padding: "2px 10px",
                fontWeight: 700,
                fontSize: "11px",
                fontFamily: "monospace",
                display: "inline-block",
                width: "fit-content",
              }}
            >
              {slug || "—"}
            </Tag>
            <Select
              value={slug}
              style={{ width: 150 }}
              loading={roleLoading}
              //   disabled={isAdmin(record)}
              onChange={(value) =>
                handleRoleChange(record.id || record._id, value)
              }
              size="small"
            >
              {roles.map((r) => (
                <Option key={r.slug} value={r.slug}>
                  {r.name}
                </Option>
              ))}
            </Select>
          </div>
        );
      },
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text style={{ color: "#64748b", fontSize: "12.5px" }}>
          {formatDate(date)}
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Xóa người dùng này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id || record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            // disabled={isAdmin(record)}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              //   disabled={isAdmin(record)}
              style={{ borderRadius: "6px" }}
            />
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
        .user-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          font-weight: 600 !important;
          color: #475569 !important;
        }
      `}</style>

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}
          >
            <UserOutlined style={{ marginRight: "10px", color: "#4f46e5" }} />
            Quản lý người dùng
          </Title>
          <Text style={{ color: "#64748b" }}>
            Xem, phân quyền và quản lý tài khoản người dùng trong hệ thống.
          </Text>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "12px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a" }}>
            {pagination.total || users.length}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Tổng người dùng
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Search
          placeholder="Tìm theo tên hoặc email..."
          onSearch={(value) => setSearch(value)}
          onChange={(e) => !e.target.value && setSearch("")}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Lọc theo vai trò"
          style={{ width: 180 }}
          allowClear
          loading={roleLoading}
          value={roleFilter}
          onChange={(value) => setRoleFilter(value)}
        >
          {roles.map((r) => (
            <Option key={r.slug} value={r.slug}>
              {r.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Table
          className="user-table"
          columns={columns}
          dataSource={users}
          rowKey={(record) => record.id || record._id}
          loading={loading}
          scroll={{ x: true }}
          pagination={
            pagination.total
              ? {
                  total: pagination.total,
                  current: pagination.page,
                  pageSize: pagination.limit,
                  showSizeChanger: false,
                  showTotal: (total) => `Tổng ${total} người dùng`,
                }
              : false
          }
        />
      </div>
    </div>
  );
};

export default UserPageAdmin;
