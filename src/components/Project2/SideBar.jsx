import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  ProfileOutlined,
  MessageOutlined,
  CommentOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = (() => {
   
    if (location.pathname.startsWith("/status")) return "status";
     
  
    return "";
  })();

  return (
    <Sider
      collapsible
      collapsed={collapsed && !hovered}
      trigger={null}
      style={{
        minHeight: "100vh",
        transition: "all 0.2s ease",
        background: "#001529",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: collapsed && !hovered ? "center" : "flex-end",
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "#fff" }}
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => {
          if (key === "home") navigate("/tasks");
          else navigate(`/${key}`);
        }}
        items={[
   
          { key: "status", icon: <ProfileOutlined />, label: "Status" },
           
        ]}
        style={{ background: "#fff" }}
      />
    </Sider>
  );
};

export default Sidebar;