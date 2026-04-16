import React, { useState } from 'react';
import { 
    Table, 
    Button, 
    Space, 
    Tag, 
    Typography, 
    Modal, 
    Form, 
    Input, 
    Select, 
    message, 
    Popconfirm 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useQuery from '@/hooks/useQuery';
import { adminBlogServices } from '@/services/adminServices/blogServices';
import { formatDate } from '@/utils/format';

const { Title } = Typography;
const { Option } = Select;

const BlogPageAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [form] = Form.useForm();

    // Lấy danh sách bài viết
    const { data: blogsData, loading, refetch } = useQuery(() => adminBlogServices.getBlogs("?status=all"));
    const blogs = blogsData?.blogs || [];

    // Lấy danh mục
    const { data: categoriesData } = useQuery(adminBlogServices.getCategories);
    const categories = categoriesData || [];

    const showModal = (blog = null) => {
        setEditingBlog(blog);
        if (blog) {
            form.setFieldsValue({
                ...blog,
                category: blog.category?._id
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBlog(null);
    };

    const onFinish = async (values) => {
        try {
            if (editingBlog) {
                await adminBlogServices.updateBlog(editingBlog._id, values);
                message.success('Cập nhật bài viết thành công!');
            } else {
                await adminBlogServices.createBlog(values);
                message.success('Tạo bài viết mới thành công!');
            }
            handleCancel();
            refetch();
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await adminBlogServices.deleteBlog(id);
            message.success('Xóa bài viết thành công!');
            refetch();
        } catch (error) {
            message.error('Không thể xóa bài viết!');
        }
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (cat) => cat?.name || 'Uncategorized',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'published' ? 'green' : 'orange'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => showModal(record)}
                        type="primary"
                        ghost
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa bài viết này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Title level={2}>Quản lý bài viết</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => showModal()}
                >
                    Thêm bài viết mới
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={blogs} 
                rowKey="_id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ status: 'published' }}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề bài viết"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            style={{ flex: 1 }}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map(cat => (
                                    <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            style={{ flex: 1 }}
                        >
                            <Select>
                                <Option value="published">Published</Option>
                                <Option value="draft">Draft</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="thumbnail"
                        label="Ảnh bài viết (URL)"
                    >
                        <Input placeholder="Link hình ảnh bài viết..." />
                    </Form.Item>

                    <Form.Item
                        name="shortDescription"
                        label="Mô tả ngắn"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung"
                    >
                        <Input.TextArea rows={10} placeholder="Nội dung bài viết (có thể dùng HTML)..." />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
                        <Space>
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                {editingBlog ? "Cập nhật" : "Lưu bài"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogPageAdmin;
