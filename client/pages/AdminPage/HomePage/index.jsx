import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography } from 'antd';
import { 
    BookOutlined, 
    FileTextOutlined, 
    UserOutlined, 
    ShoppingCartOutlined,
    DollarCircleOutlined 
} from '@ant-design/icons';
import useQuery from '@/hooks/useQuery';
import { adminStatsService } from '@/services/adminServices/adminStatsService';
import { formatCurrency, formatDate } from '@/utils/format';

const { Title } = Typography;

const HomePageAdmin = () => {
    const { data: statsData, loading } = useQuery(adminStatsService.getStats);
    const stats = statsData || {};

    const columns = [
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
            render: (customer) => `${customer?.firstName} ${customer?.lastName}`,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                if (status === 'completed') color = 'green';
                if (status === 'cancelled') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Tổng quan hệ thống</Title>
            
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card loading={loading}>
                        <Statistic
                            title="Khóa học"
                            value={stats.counts?.courses || 0}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card loading={loading}>
                        <Statistic
                            title="Bài viết"
                            value={stats.counts?.blogs || 0}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card loading={loading}>
                        <Statistic
                            title="Học viên"
                            value={stats.counts?.customers || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card loading={loading}>
                        <Statistic
                            title="Đơn hàng"
                            value={stats.counts?.orders || 0}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8}>
                    <Card loading={loading}>
                        <Statistic
                            title="Tổng doanh thu"
                            value={stats.totalRevenue || 0}
                            prefix={<DollarCircleOutlined />}
                            formatter={(value) => formatCurrency(value)}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card title="Giao dịch gần đây" loading={loading}>
                        <Table
                            columns={columns}
                            dataSource={stats.recentOrders || []}
                            rowKey="_id"
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card title="Khóa học phổ biến" loading={loading}>
                        <Table
                            columns={[
                                { title: 'Tên khóa học', dataIndex: 'title', key: 'title' },
                                { title: 'Học viên', dataIndex: 'enrollCount', key: 'enrollCount' },
                                { title: 'Giá', dataIndex: 'price', key: 'price', render: (p) => formatCurrency(p) },
                            ]}
                            dataSource={stats.popularCourses || []}
                            rowKey="_id"
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HomePageAdmin;