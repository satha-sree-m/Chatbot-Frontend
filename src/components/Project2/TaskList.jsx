import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Layout,
  Button,
  Input,
  Modal,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../Project2/context/AuthContext";
import Sidebar from "../Project2/Sidebar"; 

const { Content } = Layout;

const TaskList = () => {
  const { taskListId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const token = Cookies.get("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [subtaskData, setSubtaskData] = useState({ title: "" });
  const [selectedKey, setSelectedKey] = useState("taskmanager");

  const fetchSubtasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasklist/${taskListId}`);
      setSubtasks(res.data);
    } catch (err) {
      message.error("Failed to fetch subtasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskListId) fetchSubtasks();
  }, [taskListId]);

  const handleSaveSubtask = async () => {
    if (!subtaskData.title.trim()) return message.warning("Title is required!");

    try {
      if (editingSubtask) {
        await api.put(`/tasklist/update/${editingSubtask._id}`, subtaskData);
        message.success("Subtask updated!");
      } else {
        await api.post("/tasklist", { taskId: taskListId, ...subtaskData });
        message.success("Subtask added!");
      }

      setSubtaskData({ title: "" });
      setEditingSubtask(null);
      setIsModalOpen(false);
      fetchSubtasks();
    } catch (err) {
      message.error("Error saving subtask");
      console.error(err);
    }
  };

  const handleDeleteSubtask = async (id) => {
    try {
      await api.put(`/tasklist/delete/${id}`);
      setSubtasks((prev) => prev.filter((st) => st._id !== id));
      message.success("Subtask deleted!");
    } catch (err) {
      message.error("Error deleting subtask");
      console.error(err);
    }
  };

  const handleEditSubtask = (subtask) => {
    setEditingSubtask(subtask);
    setSubtaskData({ title: subtask.title });
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    message.success("Logged out!");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Layout>
        <Content style={{ padding: 20, background: "#f3f4f6" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0 }}>TASK LISTS</h2>
            <LogoutOutlined
              onClick={handleLogout}
              style={{
                fontSize: "22px",
                color: "#110303ff",
                cursor: "pointer",
                transition: "color 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "red";
                e.currentTarget.style.transform = "scale(1.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#110303ff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingSubtask(null);
              setSubtaskData({ title: "" });
              setIsModalOpen(true);
            }}
            style={{ marginBottom: 16 }}
          >
            Add TaskList
          </Button>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {subtasks.length === 0 ? (
              <div>No tasklists yet. Add one!</div>
            ) : (
              subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#333",
                  }}
                  onClick={() => navigate(`/tasks/${subtask._id}/todos`)}
                >
                  <div>{subtask.title}</div>

                  <div
                    style={{ display: "flex", gap: 8 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEditSubtask(subtask)}
                    />

                    <Popconfirm
                      title="Are you sure to delete this tasklist?"
                      onConfirm={() => handleDeleteSubtask(subtask._id)}
                      okText="Yes"
                      cancelText="No"
                      placement="topRight"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                </div>
              ))
            )}
          </div>

          <Modal
            title={editingSubtask ? "Update TaskList" : "Add TaskList"}
            open={isModalOpen}
            onOk={handleSaveSubtask}
            onCancel={() => setIsModalOpen(false)}
            okText={editingSubtask ? "Save" : "Add"}
          >
            <Input
              placeholder="TaskList Title"
              value={subtaskData.title}
              onChange={(e) =>
                setSubtaskData({ ...subtaskData, title: e.target.value })
              }
              style={{ marginBottom: 12 }}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TaskList;
