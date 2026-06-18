import React, { Suspense, useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Spin,
  Avatar,
  Dropdown,
  Typography,
  Tooltip,
  Popover,
  Badge,
  List,
  Button,
  Space,
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  MailOutlined,
  CheckOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import AuthModal from "@/features/auth/components/AuthModal";
import Overlay from "@/components/Overlay";
import moment from "moment";
import "moment/locale/vi";
import useQuery from "@/hooks/useQuery";
import useMutation from "@/hooks/useMutation";
import { notificationService } from "@/services/adminServices/notificationService";
import { useAuthContext } from "@/context/AuthContext";

moment.locale("vi");

const { Sider, Content } = Layout;
const { Text } = Typography;

// Cấu hình menu items
const NAV_ITEMS = [
  {
    key: "/admin",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "/admin",
  },
  {
    key: "/admin/course",
    icon: <BookOutlined />,
    label: "Khóa học",
    path: "/admin/course",
  },
  {
    key: "/admin/blog",
    icon: <FileTextOutlined />,
    label: "Bài viết",
    path: "/admin/blog",
  },
  {
    key: "/admin/users",
    icon: <TeamOutlined />,
    label: "Người dùng",
    path: "/admin/users",
  },
  {
    key: "/admin/roles",
    icon: <SafetyCertificateOutlined />,
    label: "Vai trò",
    path: "/admin/roles",
  },
];

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 70;

const AdminLayout = () => {
  const { profile, handleLogout } = useAuthContext();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const collapsedVal = isMobile ? false : collapsed;
  const location = useLocation();
  const navigate = useNavigate();

  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
      navigate("/");
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  const [notificationOpen, setNotificationOpen] = useState(false);

  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 10000,
  });

  const { execute: readNotification } = useMutation(
    notificationService.markRead,
  );
  const { execute: readAllNotifications } = useMutation(
    notificationService.markAllRead,
  );
  const { execute: clearAllNotifications } = useMutation(
    notificationService.clearAll,
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await readNotification(notification.id);
      refetchNotifications();
    }
    setNotificationOpen(false);

    if (notification.type === "user") {
      navigate("/admin/users");
    } else if (notification.type === "order") {
      navigate("/admin");
    }
  };

  const handleMarkAllRead = async () => {
    await readAllNotifications();
    refetchNotifications();
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    refetchNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "user":
        return <UserOutlined style={{ fontSize: "16px", color: "#4f46e5" }} />;
      case "order":
        return (
          <ShoppingCartOutlined
            style={{ fontSize: "16px", color: "#10b981" }}
          />
        );
      case "subscribe":
        return <MailOutlined style={{ fontSize: "16px", color: "#f59e0b" }} />;
      default:
        return <BellOutlined style={{ fontSize: "16px", color: "#94a3b8" }} />;
    }
  };

  const notificationContent = (
    <div style={{ width: 340 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px 12px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Text style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
          Thông báo ({unreadCount})
        </Text>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {unreadCount > 0 && (
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined style={{ fontSize: "12px" }} />}
              onClick={handleMarkAllRead}
              style={{ fontSize: "12px", color: "#4f46e5", padding: "0 4px" }}
            >
              Đọc tất cả
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              type="text"
              size="small"
              danger
              icon={<ClearOutlined style={{ fontSize: "12px" }} />}
              onClick={handleClearAll}
              style={{ fontSize: "12px", padding: "0 4px" }}
            >
              Xóa hết
            </Button>
          )}
        </div>
      </div>

      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        <List
          dataSource={notifications}
          locale={{ emptyText: "Không có thông báo mới" }}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleNotificationClick(item)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                background: item.isRead ? "transparent" : "#f0fdf4",
                borderBottom: "1px solid #f1f5f9",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
              className="notification-item"
            >
              <div
                style={{
                  marginTop: "3px",
                  background: item.isRead ? "#f1f5f9" : "#e8faf0",
                  borderRadius: "8px",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getNotificationIcon(item.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: item.isRead ? 500 : 700,
                    fontSize: "12.5px",
                    color: "#0f172a",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "#64748b",
                    marginTop: "2px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.message}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    marginTop: "4px",
                  }}
                >
                  {moment(item.createdAt).fromNow()}
                </div>
              </div>
              {!item.isRead && (
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10b981",
                    marginTop: "6px",
                    flexShrink: 0,
                  }}
                />
              )}
            </List.Item>
          )}
        />
      </div>
    </div>
  );

  // Xác định key đang active dựa trên pathname
  const activeKey =
    NAV_ITEMS.slice()
      .reverse()
      .find((item) => location.pathname.startsWith(item.key))?.key || "/admin";

  const userDropdownItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Tài khoản của tôi",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <style>{`
        /* Sidebar */
        .admin-sider {
          position: fixed !important;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
          box-shadow: 2px 0 12px rgba(0,0,0,0.08);
          background: #0f172a !important;
          transition: width 0.2s ease, left 0.2s ease !important;
        }
        /* Utility classes for all admin pages */
        .admin-page-container {
          padding: 24px;
        }
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          margin-right: 12px;
          color: #64748b;
        }
        .mobile-menu-toggle:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        /* Logo area */
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          cursor: pointer;
          transition: padding 0.2s ease, flex-direction 0.2s ease !important;
        }
        .admin-logo.collapsed {
          flex-direction: column !important;
          padding: 20px 8px 16px !important;
          gap: 12px !important;
        }
        .admin-logo-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          font-weight: 900;
          letter-spacing: -1px;
        }
        .admin-logo-text {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
        }
        .admin-logo-text span {
          color: #818cf8;
        }
        /* Toggle button */
        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: auto;
          flex-shrink: 0;
        }
        .sidebar-toggle:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        /* Nav section label */
        .nav-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #475569;
          text-transform: uppercase;
          padding: 20px 20px 8px;
          white-space: nowrap;
          overflow: hidden;
        }
        /* Menu item overrides */
        .admin-menu.ant-menu {
          background: transparent !important;
          border: none !important;
          padding: 0 10px;
        }
        .admin-menu .ant-menu-item {
          height: 44px !important;
          line-height: 44px !important;
          border-radius: 10px !important;
          margin: 2px 0 !important;
          padding: 0 14px !important;
          color: #94a3b8 !important;
          transition: all 0.18s ease !important;
        }
        .admin-menu .ant-menu-item:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #e2e8f0 !important;
        }
        .admin-menu .ant-menu-item-selected {
          background: linear-gradient(90deg, rgba(99,102,241,0.25), rgba(99,102,241,0.1)) !important;
          color: #fff !important;
          border-left: 3px solid #6366f1 !important;
        }
        .admin-menu .ant-menu-item-selected .anticon {
          color: #818cf8 !important;
        }
        .admin-menu .ant-menu-item .anticon {
          font-size: 16px !important;
          transition: all 0.18s !important;
        }
        .admin-menu .ant-menu-title-content {
          font-size: 13.5px;
          font-weight: 500;
        }
        /* Sidebar footer */
        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-footer-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.18s;
          overflow: hidden;
        }
        .sidebar-footer-user:hover {
          background: rgba(255,255,255,0.06);
        }
        /* Top Header */
        .admin-header {
          position: fixed;
          top: 0;
          right: 0;
          height: 60px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 16px;
          z-index: 99;
          transition: left 0.2s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .header-breadcrumb {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: #64748b;
        }
        .header-breadcrumb-active {
          font-weight: 600;
          color: #0f172a;
        }
        .header-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.18s;
        }
        .header-action-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        /* Main content */
        .admin-main-content {
          background: transparent;
          transition: margin-left 0.2s ease;
          margin-top: 60px;
          min-height: calc(100vh - 60px);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .admin-sider {
            position: fixed !important;
            left: -240px !important;
            width: 240px !important;
            max-width: 240px !important;
            min-width: 240px !important;
            z-index: 1000 !important;
            transition: left 0.3s ease !important;
          }
          .admin-sider.mobile-active {
            left: 0 !important;
          }
          .admin-layout-main {
            margin-left: 0 !important;
          }
          .admin-header {
            left: 0 !important;
            padding: 0 16px !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
          .admin-page-container {
            padding: 16px !important;
          }
          .admin-page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .ant-table-content {
            overflow-x: auto !important;
          }
        }
        .notification-item {
          transition: background 0.2s;
        }
        .notification-item:hover {
          background: #f8fafc !important;
        }
        .notification-popover .ant-popover-inner {
          padding: 8px 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1) !important;
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <Sider
        className={`admin-sider ${mobileVisible ? "mobile-active" : ""}`}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        collapsed={collapsedVal}
        trigger={null}
      >
        {/* Logo */}
        <div
          className={`admin-logo ${collapsedVal ? "collapsed" : ""}`}
          onClick={() => navigate("/admin")}
        >
          <div className="admin-logo-icon">A</div>
          {!collapsedVal && (
            <>
              <div className="admin-logo-text">
                CFD <span>Admin</span>
              </div>
              <div
                className="sidebar-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    setMobileVisible(false);
                  } else {
                    setCollapsed(true);
                  }
                }}
              >
                <MenuFoldOutlined style={{ fontSize: "14px" }} />
              </div>
            </>
          )}
          {collapsedVal && (
            <div
              className="sidebar-toggle"
              style={{ margin: "0 auto" }}
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(false);
              }}
            >
              <MenuUnfoldOutlined style={{ fontSize: "14px" }} />
            </div>
          )}
        </div>

        {/* Nav label */}
        {!collapsedVal && <div className="nav-section-label">Navigation</div>}

        {/* Menu */}
        <Menu
          className="admin-menu"
          mode="inline"
          selectedKeys={[activeKey]}
          inlineCollapsed={collapsedVal}
          onClick={() => setMobileVisible(false)}
          items={NAV_ITEMS.map((item) => ({
            key: item.key,
            icon: collapsedVal ? (
              <Tooltip title={item.label} placement="right">
                {item.icon}
              </Tooltip>
            ) : (
              item.icon
            ),
            label: <Link to={item.path}>{item.label}</Link>,
          }))}
        />

        {/* Sidebar footer user */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-user" onClick={() => navigate("/profile")}>
            <Avatar
              size={34}
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                flexShrink: 0,
              }}
              src={profile?.avatar}
              icon={!profile?.avatar && <UserOutlined />}
            />
            {!collapsedVal && (
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#e2e8f0",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Admin' : 'Administrator'}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#475569",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {profile?.email || 'admin@cfd.vn'}
                </div>
              </div>
            )}
          </div>
        </div>
      </Sider>

      {/* ── MAIN AREA ── */}
      <Layout
        className="admin-layout-main"
        style={{
          marginLeft: collapsedVal ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          transition: "margin-left 0.2s ease",
        }}
      >
        {/* Top Header */}
        <div
          className="admin-header"
          style={{
            left: collapsedVal ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          }}
        >
          {/* Hamburger toggle for mobile */}
          <div
            className="mobile-menu-toggle"
            onClick={() => setMobileVisible(true)}
          >
            <MenuUnfoldOutlined style={{ fontSize: "16px" }} />
          </div>

          {/* Breadcrumb */}
          <div className="header-breadcrumb">
            <HomeOutlined style={{ color: "#94a3b8" }} />
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span className="header-breadcrumb-active">
              {NAV_ITEMS.find((i) => i.key === activeKey)?.label || "Dashboard"}
            </span>
          </div>

          {/* Actions */}
          <Popover
            content={notificationContent}
            trigger="click"
            open={notificationOpen}
            onOpenChange={setNotificationOpen}
            placement="bottomRight"
            arrow={false}
            overlayClassName="notification-popover"
          >
            <div className="header-action-btn">
              <Badge count={unreadCount} size="small" offset={[2, -2]}>
                <BellOutlined style={{ fontSize: "15px", color: "#64748b" }} />
              </Badge>
            </div>
          </Popover>

          <Dropdown
            menu={{ items: userDropdownItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <Avatar
                size={34}
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                }}
                src={profile?.avatar}
                icon={!profile?.avatar && <UserOutlined />}
              />
              {/* Name visible on larger screens */}
              <div style={{ lineHeight: 1.3 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Admin' : 'Admin'}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {profile?.role?.name || 'Super Admin'}
                </div>
              </div>
            </div>
          </Dropdown>
        </div>

        {/* Page Content */}
        <Content className="admin-main-content">
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <Spin size="large" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </Content>
      </Layout>

      {mobileVisible && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setMobileVisible(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 999,
          }}
        />
      )}
      <Overlay />
      <AuthModal />
    </Layout>
  );
};

export default AdminLayout;
