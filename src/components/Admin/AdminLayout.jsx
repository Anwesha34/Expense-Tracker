import {
  AppstoreAddOutlined,
  BarChartOutlined,
  MenuOutlined,
  LogoutOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Image, Menu, Button } from "antd";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useSWR from "swr";

const { Sider, Header, Content, Footer } = Layout;

// API Fetcher
const fetcher = (url) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

// Sidebar Menu Items (ADMIN)
const items = [
  {
    key: "/app/admin/dashboard",
    label: "Dashboard",
    icon: <AppstoreAddOutlined />,
  },
  {
    key: "/app/admin/report",
    label: "Reports",
    icon: <BarChartOutlined />,
  },
  {
    key: "/app/admin/transactions",
    label: "Transactions",
    icon: <DollarOutlined />,
  },
  {
    key: "/app/admin/users",   
    label: "Users",
    icon: <UserOutlined />,
  },

];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const { data: session } = useSWR("/api/user/session", fetcher);

  const siderStyle = {
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    height: "100vh",
  };

  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  const handleNavigate = ({ key }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }

    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        style={siderStyle}
        collapsible
        collapsed={collapsed}
        trigger={null}
      >
        <div className="flex justify-center items-center my-4">
          <Image
            src="/exp-img.jpg"
            width={60}
            height={60}
            preview={false}
            className="rounded-full"
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/app/admin/dashboard"]}
          items={items}
          onClick={handleNavigate}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header style={headerStyle}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <div className="flex items-center gap-3">
            <span className="font-medium">
              {session?.user?.name || "Admin"}
            </span>

            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer className="text-center">
          Admin Panel ©2026
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;