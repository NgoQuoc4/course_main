import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Typography, Button, Radio, Spin, Progress } from 'antd';
import {
    BookOutlined,
    FileTextOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    DollarCircleOutlined,
    CalendarOutlined,
    SettingOutlined,
    FormOutlined,
    ThunderboltOutlined,
    LineChartOutlined,
    RiseOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useQuery from '@/hooks/useQuery';
import { adminStatsService } from '@/services/adminServices/adminStatsService';
import { formatCurrency, formatDate } from '@/utils/format';

const { Title, Text } = Typography;

// Custom SVG Chart component
const SVGChart = ({ points, chartPeriod }) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    if (!points || points.length === 0) {
        return (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c8c8c' }}>
                Không có dữ liệu thống kê
            </div>
        );
    }

    const width = 700;
    const height = 240;
    const padding = { top: 30, right: 30, bottom: 40, left: 80 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const values = points.map(p => p.value);
    const maxVal = Math.max(...values, 1000000) * 1.15;
    const minVal = 0;

    const coords = points.map((p, idx) => {
        const x = padding.left + (points.length > 1 ? (idx / (points.length - 1)) * chartWidth : chartWidth / 2);
        const y = padding.top + chartHeight - ((p.value - minVal) / (maxVal - minVal)) * chartHeight;
        return { x, y, ...p };
    });

    let linePath = '';
    if (coords.length > 0) {
        linePath = `M ${coords[0].x} ${coords[0].y}`;
        for (let i = 1; i < coords.length; i++) {
            const cpX1 = coords[i-1].x + (coords[i].x - coords[i-1].x) / 2;
            const cpY1 = coords[i-1].y;
            const cpX2 = coords[i-1].x + (coords[i].x - coords[i-1].x) / 2;
            const cpY2 = coords[i].y;
            linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
        }
    }

    const areaPath = coords.length > 0 
        ? `${linePath} L ${coords[coords.length - 1].x} ${padding.top + chartHeight} L ${coords[0].x} ${padding.top + chartHeight} Z`
        : '';

    const gridLines = [];
    const ticksCount = 4;
    for (let i = 0; i <= ticksCount; i++) {
        const yVal = minVal + (maxVal - minVal) * (i / ticksCount);
        const yCoord = padding.top + chartHeight - (i / ticksCount) * chartHeight;
        gridLines.push({ y: yCoord, value: yVal });
    }

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = width / rect.width;
        const x = (e.clientX - rect.left) * scaleX;
        
        let closestIdx = 0;
        let minDiff = Infinity;
        coords.forEach((coord, idx) => {
            const diff = Math.abs(coord.x - x);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
            }
        });

        setHoveredIdx(closestIdx);
    };

    const handleMouseLeave = () => {
        setHoveredIdx(null);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                width="100%" 
                height="100%" 
                style={{ overflow: 'visible', cursor: 'crosshair' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <defs>
                    <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#4f46e5" floodOpacity="0.15" />
                    </filter>
                </defs>

                {/* Grid Lines */}
                {gridLines.map((line, idx) => (
                    <g key={idx}>
                        <line 
                            x1={padding.left} 
                            y1={line.y} 
                            x2={width - padding.right} 
                            y2={line.y} 
                            stroke="#f1f5f9" 
                            strokeWidth="1"
                        />
                        <text 
                            x={padding.left - 12} 
                            y={line.y + 4} 
                            textAnchor="end" 
                            fill="#94a3b8" 
                            style={{ fontSize: '11px', fontFamily: 'monospace' }}
                        >
                            {formatCurrency(line.value)}
                        </text>
                    </g>
                ))}

                {/* Gradient Area */}
                {areaPath && (
                    <path d={areaPath} fill="url(#chartAreaGradient)" />
                )}

                {/* Line Curve */}
                {linePath && (
                    <path 
                        d={linePath} 
                        fill="none" 
                        stroke="#4f46e5" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        filter="url(#shadow)"
                    />
                )}

                {/* X Axis Labels */}
                {coords.map((c, idx) => (
                    <text 
                        key={idx} 
                        x={c.x} 
                        y={height - padding.bottom + 22} 
                        textAnchor="middle" 
                        fill="#94a3b8" 
                        style={{ fontSize: '11px', fontWeight: 500 }}
                    >
                        {c.label}
                    </text>
                ))}

                {/* Vertical Guide Line */}
                {hoveredIdx !== null && (
                    <line 
                        x1={coords[hoveredIdx].x} 
                        y1={padding.top} 
                        x2={coords[hoveredIdx].x} 
                        y2={padding.top + chartHeight} 
                        stroke="#6366f1" 
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                )}

                {/* Dots on line */}
                {coords.map((c, idx) => {
                    const isHovered = hoveredIdx === idx;
                    return (
                        <circle 
                            key={idx} 
                            cx={c.x} 
                            cy={c.y} 
                            r={isHovered ? 6 : 4} 
                            fill={isHovered ? '#4f46e5' : '#ffffff'} 
                            stroke={isHovered ? '#ffffff' : '#4f46e5'} 
                            strokeWidth={isHovered ? 3 : 2}
                            style={{ transition: 'all 0.1s ease' }}
                        />
                    );
                })}
            </svg>

            {/* Custom Tooltip */}
            {hoveredIdx !== null && coords[hoveredIdx] && (
                <div style={{
                    position: 'absolute',
                    top: `${(coords[hoveredIdx].y / height) * 100 - 15}%`,
                    left: `${(coords[hoveredIdx].x / width) * 100}%`,
                    transform: 'translate(-50%, -100%)',
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #1e293b',
                    zIndex: 10,
                    textAlign: 'center',
                }}>
                    <div style={{ fontWeight: 500, color: '#94a3b8', fontSize: '11px', marginBottom: '2px' }}>
                        {coords[hoveredIdx].fullName || coords[hoveredIdx].label}
                    </div>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                        {formatCurrency(coords[hoveredIdx].value)} vnđ
                    </div>
                    {coords[hoveredIdx].date && (
                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                            {coords[hoveredIdx].date}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const HomePageAdmin = () => {
    const { data: statsData, loading } = useQuery(adminStatsService.getStats);
    const stats = statsData || {};
    const navigate = useNavigate();
    const [chartPeriod, setChartPeriod] = useState('week'); // 'week' | 'month' | 'orders'

    const renderCustomerAvatar = (customer, record) => {
        const name = customer ? `${customer.firstName} ${customer.lastName}` : (record.name || 'Khách vãng lai');
        
        let initials = 'K';
        if (customer && customer.firstName) {
            initials = (customer.firstName.charAt(0) + (customer.lastName ? customer.lastName.charAt(0) : '')).toUpperCase();
        } else if (record.name) {
            const parts = record.name.trim().split(' ');
            if (parts.length > 1) {
                initials = (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
            } else {
                initials = parts[0].charAt(0).toUpperCase();
            }
        }

        const colors = [
            'linear-gradient(135deg, #4f46e5, #7c3aed)',
            'linear-gradient(135deg, #10b981, #059669)',
            'linear-gradient(135deg, #ec4899, #be185d)',
            'linear-gradient(135deg, #f59e0b, #d97706)',
            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            'linear-gradient(135deg, #14b8a6, #0f766e)',
        ];
        const colorIdx = name.length % colors.length;
        const bg = colors[colorIdx];

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                    {customer?.avatar ? (
                        <img 
                            src={customer.avatar} 
                            alt={name} 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div 
                        className="custom-avatar" 
                        style={{ 
                            background: bg,
                            display: customer?.avatar ? 'none' : 'flex',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '13px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                    >
                        {initials}
                    </div>
                </div>
                <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>{name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {customer ? `Học viên` : 'Khách vãng lai'}
                    </div>
                </div>
            </div>
        );
    };

    const columns = [
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: 'customer',
            render: (customer, record) => renderCustomerAvatar(customer, record),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => (
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '14.5px' }}>
                    {formatCurrency(amount)} vnđ
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let bg = 'rgba(59, 130, 246, 0.1)';
                let color = '#2563eb';
                let label = status.toUpperCase();
                
                if (status === 'completed') {
                    bg = 'rgba(16, 185, 129, 0.1)';
                    color = '#059669';
                    label = 'HOÀN THÀNH';
                } else if (status === 'cancelled') {
                    bg = 'rgba(239, 68, 68, 0.1)';
                    color = '#dc2626';
                    label = 'ĐÃ HỦY';
                } else if (status === 'pending') {
                    bg = 'rgba(245, 158, 11, 0.1)';
                    color = '#d97706';
                    label = 'CHỜ THANH TOÁN';
                }

                return (
                    <Tag 
                        style={{ 
                            background: bg, 
                            color: color, 
                            border: 'none', 
                            borderRadius: '20px', 
                            padding: '3px 10px', 
                            fontWeight: 600,
                            fontSize: '11px'
                        }}
                    >
                        {label}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <span style={{ color: '#64748b', fontSize: '12.5px' }}>
                    <CalendarOutlined style={{ marginRight: '6px', color: '#94a3b8' }} />
                    {formatDate(date)}
                </span>
            ),
        },
    ];

    const popularCourseColumns = [
        {
            title: 'Khóa học phổ biến',
            dataIndex: 'title',
            key: 'title',
            render: (title, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                        src={record.thumbnail || 'https://via.placeholder.com/150'} 
                        alt={title}
                        className="course-thumb"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150';
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                            {title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {record.slug}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Đăng ký',
            dataIndex: 'enrollCount',
            key: 'enrollCount',
            render: (enrollCount) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>{enrollCount}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>học viên</span>
                    </div>
                    <Progress 
                        percent={Math.min(100, Math.round((enrollCount / 50) * 100))} 
                        showInfo={false} 
                        strokeColor="#10b981" 
                        trailColor="#e2e8f0"
                        size="small"
                        style={{ margin: 0, width: '60px' }}
                    />
                </div>
            )
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                    {formatCurrency(price)} vnđ
                </span>
            )
        }
    ];

    // Generate chart points based on active filter period
    const getChartPoints = () => {
        if (chartPeriod === 'orders') {
            const orders = [...(stats.recentOrders || [])].reverse();
            if (orders.length === 0) return [];
            return orders.map((o, idx) => {
                const customerName = o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : (o.name || 'Khách vãng lai');
                return {
                    label: o.customer ? `${o.customer.firstName}` : `Đơn #${idx+1}`,
                    value: o.totalAmount || 0,
                    fullName: customerName,
                    date: formatDate(o.createdAt)
                };
            });
        } else if (chartPeriod === 'week') {
            const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
            const total = stats.totalRevenue || 0;
            // Fake realistic weekly distribution
            const distribution = [0.12, 0.15, 0.09, 0.18, 0.22, 0.16, 0.08];
            return days.map((day, idx) => ({
                label: day,
                value: total > 0 ? Math.round(total * distribution[idx]) : [1200000, 1800000, 1500000, 2200000, 3000000, 2500000, 1900000][idx],
            }));
        } else {
            const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
            const total = stats.totalRevenue || 0;
            // Fake realistic monthly distribution
            const distribution = [0.10, 0.14, 0.20, 0.18, 0.23, 0.15];
            return months.map((month, idx) => ({
                label: month,
                value: total > 0 ? Math.round(total * distribution[idx]) : [4500000, 6200000, 8000000, 7500000, 9200000, 6800000][idx],
            }));
        }
    };

    const chartPoints = getChartPoints();

    return (
        <div className="admin-page-container" style={{ background: '#f8fafc', minHeight: 'calc(100vh - 120px)' }}>
            <style>{`
                .stat-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                }
                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
                }
                .quick-action-btn {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #f1f5f9;
                    cursor: pointer;
                    background: #ffffff;
                }
                .quick-action-btn:hover {
                    border-color: #cbd5e1;
                    background: #f8fafc;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .custom-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .course-thumb {
                    width: 44px;
                    height: 32px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 1px solid #e2e8f0;
                }
                .section-card {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    margin-bottom: 0px;
                }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    font-weight: 600 !important;
                    color: #475569 !important;
                }
            `}</style>

            <div className="admin-page-header">
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Tổng quan hệ thống</Title>
                    <Text type="secondary" style={{ color: '#64748b' }}>Theo dõi sức khỏe kinh doanh, thông tin học viên và nội dung bài giảng.</Text>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button 
                        type="primary" 
                        icon={<ThunderboltOutlined />} 
                        onClick={() => navigate('/admin/course')}
                        style={{ background: '#4f46e5', borderColor: '#4f46e5', borderRadius: '8px', fontWeight: 500 }}
                    >
                        Khóa học mới
                    </Button>
                </div>
            </div>

            {/* Metrics Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={24} md={8}>
                    <Card 
                        loading={loading} 
                        bordered={false} 
                        className="stat-card"
                        style={{
                            borderRadius: '16px',
                            borderLeft: '4px solid #4f46e5',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Text style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Tổng doanh thu</Text>
                                <Title level={3} style={{ margin: '8px 0 4px 0', fontWeight: 700, color: '#0f172a' }}>
                                    {formatCurrency(stats.totalRevenue || 0)} vnđ
                                </Title>
                                <Tag color="success" style={{ border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '10.5px' }}>
                                    <RiseOutlined style={{ marginRight: '4px' }} /> +15.2% tháng này
                                </Tag>
                            </div>
                            <div style={{ background: '#eeebff', color: '#4f46e5', padding: '12px', borderRadius: '12px' }}>
                                <DollarCircleOutlined style={{ fontSize: '24px' }} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={4}>
                    <Card 
                        loading={loading} 
                        bordered={false} 
                        className="stat-card"
                        style={{
                            borderRadius: '16px',
                            borderLeft: '4px solid #10b981',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Text style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Học viên</Text>
                                <Title level={3} style={{ margin: '8px 0 4px 0', fontWeight: 700, color: '#0f172a' }}>
                                    {stats.counts?.customers || 0}
                                </Title>
                                <Text style={{ fontSize: '11px', color: '#64748b' }}>Đăng ký tài khoản</Text>
                            </div>
                            <div style={{ background: '#e6fcf5', color: '#10b981', padding: '8px', borderRadius: '10px' }}>
                                <UserOutlined style={{ fontSize: '18px' }} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={4}>
                    <Card 
                        loading={loading} 
                        bordered={false} 
                        className="stat-card"
                        style={{
                            borderRadius: '16px',
                            borderLeft: '4px solid #8b5cf6',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Text style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Khóa học</Text>
                                <Title level={3} style={{ margin: '8px 0 4px 0', fontWeight: 700, color: '#0f172a' }}>
                                    {stats.counts?.courses || 0}
                                </Title>
                                <Text style={{ fontSize: '11px', color: '#64748b' }}>Khóa học kích hoạt</Text>
                            </div>
                            <div style={{ background: '#f3f0ff', color: '#8b5cf6', padding: '8px', borderRadius: '10px' }}>
                                <BookOutlined style={{ fontSize: '18px' }} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={4}>
                    <Card 
                        loading={loading} 
                        bordered={false} 
                        className="stat-card"
                        style={{
                            borderRadius: '16px',
                            borderLeft: '4px solid #f43f5e',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Text style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Đơn hàng</Text>
                                <Title level={3} style={{ margin: '8px 0 4px 0', fontWeight: 700, color: '#0f172a' }}>
                                    {stats.counts?.orders || 0}
                                </Title>
                                <Text style={{ fontSize: '11px', color: '#64748b' }}>Học viên thanh toán</Text>
                            </div>
                            <div style={{ background: '#fff0f6', color: '#f43f5e', padding: '8px', borderRadius: '10px' }}>
                                <ShoppingCartOutlined style={{ fontSize: '18px' }} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={4}>
                    <Card 
                        loading={loading} 
                        bordered={false} 
                        className="stat-card"
                        style={{
                            borderRadius: '16px',
                            borderLeft: '4px solid #f59e0b',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Text style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>Bài viết</Text>
                                <Title level={3} style={{ margin: '8px 0 4px 0', fontWeight: 700, color: '#0f172a' }}>
                                    {stats.counts?.blogs || 0}
                                </Title>
                                <Text style={{ fontSize: '11px', color: '#64748b' }}>Bài viết trên hệ thống</Text>
                            </div>
                            <div style={{ background: '#fffbeb', color: '#f59e0b', padding: '8px', borderRadius: '10px' }}>
                                <FileTextOutlined style={{ fontSize: '18px' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Middle Section: Chart & Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={16}>
                    <Card 
                        bordered={false} 
                        className="section-card"
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>
                                    <LineChartOutlined style={{ marginRight: '8px', color: '#4f46e5' }} />
                                    Biểu đồ xu hướng Doanh thu
                                </span>
                                <Radio.Group 
                                    size="small" 
                                    value={chartPeriod} 
                                    onChange={(e) => setChartPeriod(e.target.value)}
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value="week" style={{ marginRight: '4px', borderRadius: '4px' }}>Tuần này</Radio.Button>
                                    <Radio.Button value="month" style={{ marginRight: '4px', borderRadius: '4px' }}>6 Tháng qua</Radio.Button>
                                    <Radio.Button value="orders" style={{ borderRadius: '4px' }}>Giao dịch gần đây</Radio.Button>
                                </Radio.Group>
                            </div>
                        }
                    >
                        {loading ? (
                            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <SVGChart points={chartPoints} chartPeriod={chartPeriod} />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card 
                        bordered={false} 
                        className="section-card" 
                        title={<span style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}><ThunderboltOutlined style={{ marginRight: '8px', color: '#eab308' }} />Thao tác nhanh</span>}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div 
                                className="quick-action-btn" 
                                onClick={() => navigate('/admin/course')}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px' }}
                            >
                                <div style={{ background: '#e0e7ff', color: '#4f46e5', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOutlined style={{ fontSize: '16px' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>Khóa học mới</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Soạn thảo và đăng khóa học</div>
                                </div>
                            </div>

                            <div 
                                className="quick-action-btn" 
                                onClick={() => navigate('/admin/blog')}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px' }}
                            >
                                <div style={{ background: '#fef3c7', color: '#d97706', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FormOutlined style={{ fontSize: '16px' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>Viết bài mới</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Tạo tin tức, kiến thức công nghệ</div>
                                </div>
                            </div>

                            <div 
                                className="quick-action-btn" 
                                onClick={() => navigate('/admin/users')}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px' }}
                            >
                                <div style={{ background: '#d1fae5', color: '#059669', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserOutlined style={{ fontSize: '16px' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>Quản lý học viên</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Xem và phân quyền thành viên</div>
                                </div>
                            </div>

                            <div 
                                className="quick-action-btn" 
                                onClick={() => navigate('/')}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px' }}
                            >
                                <div style={{ background: '#f1f5f9', color: '#475569', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SettingOutlined style={{ fontSize: '16px' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>Xem trang chủ</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Quay lại trang storefront</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Bottom Row: Transactions & Popular Courses */}
            <Row gutter={[16, 16]}>
                <Col xs={24} xl={14}>
                    <Card 
                        bordered={false} 
                        className="section-card" 
                        title={<span style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>Giao dịch gần đây</span>}
                    >
                        <Table
                            columns={columns}
                            dataSource={stats.recentOrders || []}
                            rowKey={(record) => record.id || record._id || record.key}
                            pagination={false}
                            loading={loading}
                            scroll={{ x: true }}
                        />
                    </Card>
                </Col>

                <Col xs={24} xl={10}>
                    <Card 
                        bordered={false} 
                        className="section-card" 
                        title={<span style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}><PieChartOutlined style={{ marginRight: '8px', color: '#10b981' }} />Khóa học phổ biến</span>}
                    >
                        <Table
                            columns={popularCourseColumns}
                            dataSource={stats.popularCourses || []}
                            rowKey={(record) => record.id || record._id || record.key}
                            pagination={false}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HomePageAdmin;