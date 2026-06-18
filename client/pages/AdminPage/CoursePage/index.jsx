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
    InputNumber, 
    Select, 
    message, 
    Popconfirm 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useQuery from '@/hooks/useQuery';
import { courseServices } from '@/services/adminServices/courseServices';
import { formatCurrency } from '@/utils/format';

const { Title } = Typography;
const { Option } = Select;

const CoursePageAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [form] = Form.useForm();

    // Lấy danh sách khóa học
    const { data: coursesData, loading, refetch } = useQuery(() => courseServices.getCourses("?status=all"));
    const courses = coursesData?.courses || [];

    const showModal = (course = null) => {
        setEditingCourse(course);
        if (course) {
            form.setFieldsValue(course);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCourse(null);
    };

    const onFinish = async (values) => {
        try {
            if (editingCourse) {
                await courseServices.updateCourse(editingCourse._id, values);
                message.success('Cập nhật khóa học thành công!');
            } else {
                await courseServices.createCourse(values);
                message.success('Tạo khóa học mới thành công!');
            }
            handleCancel();
            refetch();
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await courseServices.deleteCourse(id);
            message.success('Xóa khóa học thành công!');
            refetch();
        } catch (error) {
            message.error('Không thể xóa khóa học!');
        }
    };

    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatCurrency(price),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'volcano'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Cấp độ',
            dataIndex: 'level',
            key: 'level',
            render: (level) => <Tag color="blue">{level.toUpperCase()}</Tag>,
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
                        title="Bạn có chắc chắn muốn xóa khóa học này?"
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
        <div className="admin-page-container">
            <div className="admin-page-header">
                <Title level={2}>Quản lý khóa học</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => showModal()}
                >
                    Thêm khóa học mới
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={courses} 
                rowKey="_id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
            />

            <Modal
                title={editingCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ status: 'active', level: 'beginner' }}
                >
                    <Form.Item
                        name="title"
                        label="Tên khóa học"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="shortDescription"
                        label="Mô tả ngắn"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    
                    <Form.Item
                        name="thumbnail"
                        label="Ảnh bìa (URL)"
                    >
                        <Input placeholder="Link hình ảnh (vd: Unsplash, Cloudinary...)" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            name="price"
                            label="Giá (VNĐ)"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                            style={{ flex: 1 }}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="salePrice"
                            label="Giá khuyến mãi"
                            style={{ flex: 1 }}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            style={{ flex: 1 }}
                        >
                            <Select>
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                                <Option value="draft">Draft</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="level"
                            label="Cấp độ"
                            style={{ flex: 1 }}
                        >
                            <Select>
                                <Option value="beginner">Beginner</Option>
                                <Option value="intermediate">Intermediate</Option>
                                <Option value="advanced">Advanced</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
                        <Space>
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                {editingCourse ? "Cập nhật" : "Lưu bài"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CoursePageAdmin;