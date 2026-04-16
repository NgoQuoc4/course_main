import React, { useState } from 'react';
import { 
    Table, 
    Typography, 
    Tag, 
    Select, 
    Space, 
    Button, 
    Popconfirm, 
    message, 
    Input 
} from 'antd';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import useQuery from '@/hooks/useQuery';
import { userAdminService } from '@/services/adminServices/userAdminService';
import { formatDate } from '@/utils/format';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const UserPageAdmin = () => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Fetch users with query params
    const { 
        data: usersData, 
        loading, 
        refetch 
    } = useQuery(() => {
        const query = `?search=${search}${roleFilter ? `&role=${roleFilter}` : ""}`;
        return userAdminService.getUsers(query);
    }, [search, roleFilter]);

    const users = usersData?.users || [];
    const pagination = usersData?.pagination || {};

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userAdminService.updateRole(userId, newRole);
            message.success('Cập nhật vai trò thành công!');
            refetch();
        } catch (error) {
            message.error('Không thể cập nhật vai trò!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await userAdminService.deleteUser(id);
            message.success('Xóa người dùng thành công!');
            refetch();
        } catch (error) {
            message.error('Không thể xóa người dùng!');
        }
    };

    const columns = [
        {
            title: 'Họ tên',
            key: 'name',
            render: (_, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (p) => p || '--',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => {
                const roleSlug = role?.slug || role;
                return (
                    <Select 
                        defaultValue={roleSlug} 
                        style={{ width: 120 }} 
                        onChange={(value) => handleRoleChange(record._id, value)}
                    >
                        <Option value="customer">Customer</Option>
                        <Option value="teacher">Teacher</Option>
                        <Option value="admin">Admin</Option>
                    </Select>
                );
            },
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                        disabled={(record.role?.slug || record.role) === 'admin'}
                    >
                        <Button 
                            icon={<DeleteOutlined />} 
                            danger 
                            disabled={(record.role?.slug || record.role) === 'admin'}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Quản lý người dùng & Phân quyền</Title>

            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <Search
                    placeholder="Tìm theo tên hoặc email"
                    onSearch={(value) => setSearch(value)}
                    style={{ width: 300 }}
                    allowClear
                />
                <Select
                    placeholder="Lọc theo vai trò"
                    style={{ width: 150 }}
                    allowClear
                    onChange={(value) => setRoleFilter(value)}
                >
                    <Option value="customer">Customer</Option>
                    <Option value="teacher">Teacher</Option>
                    <Option value="admin">Admin</Option>
                </Select>
            </div>

            <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="_id" 
                loading={loading}
                pagination={{
                    total: pagination.total,
                    current: pagination.page,
                    pageSize: pagination.limit,
                    showSizeChanger: false,
                }}
            />
        </div>
    );
};

export default UserPageAdmin;
