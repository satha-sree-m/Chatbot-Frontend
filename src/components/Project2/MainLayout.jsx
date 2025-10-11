import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabItems = [
    { key: "/app/chatbot", label: "Chatbot" },
    { key: "/app/chat", label: "Chat Application" },
    { key: "/app/tasks", label: "Project" },
  ];

  // Determine active tab based on current path
  const activeKey =
    tabItems.find((tab) => location.pathname.startsWith(tab.key))?.key || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          gap: "10px",
          padding: "10px 20px",
        }}
      >
        {tabItems.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.key)}
              style={{
                background: isActive ? "#add8e6" : "#e0f3ff", // Light blue
                color: "#000", // Black text
                border: "none",
                borderRadius: "20px",
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: isActive ? "bold" : "normal",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", padding: 16, background: "#f3f4f6" }}>
          <Outlet key={location.pathname} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
