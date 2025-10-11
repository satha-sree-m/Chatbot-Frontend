import React, { useState, useEffect } from "react";
import { Input, Button, message, Modal, Popconfirm } from "antd";
import { DeleteOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const TaskBoard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const { logout } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:5000/api/tasks",
    headers: { Authorization: `Bearer ${token}` },
  });

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/");
      setTasks(res.data);
    } catch (err) {
      message.error("Failed to fetch projects");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return message.warning("Please enter a project title!");
    try {
      if (editingTask) {
        await api.put(`/${editingTask._id}`, { title: taskTitle });
        message.success("Project updated!");
      } else {
        const res = await api.post("/", { title: taskTitle });
        setTasks(prev => [res.data, ...prev]);
        message.success("Project added!");
      }
      setTaskTitle("");
      setEditingTask(null);
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      message.error("Error saving project");
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.put(`/${taskId}`, { isDeleted: true });
      setTasks(prev => prev.filter(task => task._id !== taskId));
      message.success("Project deleted!");
    } catch (err) {
      message.error("Error deleting project");
      console.error(err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    message.success("Logged out!");
    navigate("/login");
  };

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f3f4f6" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>PROJECTS</h2>
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

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="Add new project"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <Button type="primary" onClick={handleAddTask} disabled={!taskTitle.trim()}>
          {editingTask ? "Save edit" : "Add"}
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tasks.length === 0 ? (
          <div>No projects yet.</div>
        ) : (
          tasks.map(task => (
            <div
              key={task._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                wordBreak: "break-word",
              }}
            >
              <span style={{ cursor: "pointer", flex: 1 }} onClick={() => navigate(`/tasks/${task._id}`)}>
                {task.title}
              </span>

              <div style={{ display: "flex", gap: 8 }}>
  <Button
    type="link"
    icon={<EditOutlined />}
    onClick={() => handleEditTask(task)}
  />

  <Popconfirm
    title="Are you sure to delete this project?"
    onConfirm={() => handleDeleteTask(task._id)}
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
        title={editingTask ? "Edit Project" : "Add Project"}
        open={isModalOpen}
        onOk={handleAddTask}
        onCancel={() => { setIsModalOpen(false); setEditingTask(null); setTaskTitle(""); }}
        okText={editingTask ? "save" : "Add"}
      >
        <Input
          placeholder="Project Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default TaskBoard;