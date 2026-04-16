import { Link, Outlet } from "react-router-dom"
import AuthModal from "@/features/auth/components/AuthModal"
import Overlay from "@/components/Overlay"
import PageLoading from "@/components/PageLoading"
import AuthContextProvider from "@/context/AuthContext"
import MainContextProvider from "@/context/MainContext"

import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem(<Link to="/admin">HOME</Link>, '1', <PieChartOutlined />),
    getItem(<Link to="/admin/course">COURSE</Link>, '2', <DesktopOutlined />),
    getItem(<Link to="/admin/blog">BLOG</Link>, 'sub1', <UserOutlined />,),
    getItem(<Link to="/admin/users">USERS</Link>, '10', <TeamOutlined />),
    getItem('Files', '9', <FileOutlined />),
];


const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} />
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    © {new Date().getFullYear()} DevFolio. All rights reserved.
                </Footer>
            </Layout>
            <Overlay />
            <AuthModal />
        </Layout>
    )
}

export default AdminLayout




