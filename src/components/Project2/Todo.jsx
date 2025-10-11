import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button, AutoComplete, Avatar, Popconfirm, Layout, message } from "antd";
import { EditOutlined, DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Project2/context/AuthContext";

const { Content } = Layout;

const Todo = () => {
  const { logout, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const { taskListId } = useParams(); // Current TaskList ID
  const token = Cookies.get("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "",
    date: "",
    estimatedTime: "",
  });
  const [invalidUser, setInvalidUser] = useState(false);

  // Fetch todos for current TaskList
  useEffect(() => {
    const fetchTodos = async () => {
      if (!token || !taskListId) return;
      try {
        const res = await api.get(`/todos?taskId=${taskListId}`);
        setTodos(res.data);
      } catch (err) {
        console.error("Error fetching todos:", err.response?.data || err.message);
      }
    };
    fetchTodos();
  }, [token, taskListId]);

  // Fetch statuses dynamically from backend
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await api.get("/statuses");
        setStatuses(res.data); // Expected format: [{ name: "Pending", color: "#ffbf00" }, ...]
      } catch (err) {
        console.error("Error fetching statuses:", err.response?.data || err.message);
      }
    };
    fetchStatuses();
  }, []);

  // Fetch users for autocomplete
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = newTodo.assignedTo.toLowerCase();
        if (query.length < 1) {
          setUsers([]);
          setInvalidUser(false);
          return;
        }
        const data = await getAllUsers(query);
        const matchedUsers = data.filter((u) =>
          u.userName.toLowerCase().startsWith(query)
        );
        setUsers(matchedUsers);
        setInvalidUser(
          newTodo.assignedTo &&
            matchedUsers.every(
              (u) => u.userName.toLowerCase() !== newTodo.assignedTo.toLowerCase()
            )
        );
      } catch {
        setUsers([]);
        setInvalidUser(false);
      }
    };
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [newTodo.assignedTo, getAllUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const handleAddOrEdit = async () => {
    if (!newTodo.title || !newTodo.description) {
      message.warning("Please fill Title & Description");
      return;
    }
    if (newTodo.assignedTo && invalidUser) {
      message.error("Assigned user does not exist!");
      return;
    }
    try {
      let res;
      if (editingTodo) {
        res = await api.put(`/todos/${editingTodo}`, newTodo);
        setTodos(todos.map((t) => (t._id === editingTodo ? res.data : t)));
        message.success("Todo updated!");
      } else {
        res = await api.post("/todos", { ...newTodo, taskId: taskListId });
        setTodos([...todos, res.data]);
        message.success("Todo added!");
      }
      setNewTodo({
        title: "",
        description: "",
        assignedTo: "",
        status: "",
        date: "",
        estimatedTime: "",
      });
      setEditingTodo(null);
      setInvalidUser(false);
    } catch (err) {
      console.error("Error saving todo:", err.response?.data || err.message);
      message.error(err.response?.data?.error || "Failed to save todo.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
      message.success("Todo deleted!");
    } catch {
      message.error("Error deleting todo");
    }
  };

  const handleEdit = (todo) => {
    setNewTodo({ ...todo });
    setEditingTodo(todo._id);
  };

  const getUserColor = (userName) => {
    const colors = ["#f56a00","#7265e6","#ffbf00","#00a2ae","#13c2c2","#eb2f96","#52c41a","#1890ff"];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatusColor = (statusName) => {
    const match = statuses.find((s) => s.name === statusName);
    return match ? match.color : "#000";
  };

  const handleLogout = () => {
    logout();
    message.success("Logged out!");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 20px",
          background: "#f3f4f6",
        }}
      >
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

      <Content style={{ padding: "20px", background: "#f3f4f6" }}>
        <h1 style={{ marginBottom: "20px", fontSize: "28px", fontWeight: "700", color: "#111" }}>
          Todo List
        </h1>

        {/* Add/Edit Todo */}
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              name="title"
              placeholder="Todo Title"
              value={newTodo.title}
              onChange={handleChange}
              style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
            />
            <input
              type="text"
              name="description"
              placeholder="Todo Description"
              value={newTodo.description}
              onChange={handleChange}
              style={{ flex: 2, padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
            />
            <AutoComplete
              style={{ width: 200, border: invalidUser ? "2px solid red" : "1px solid #ccc", borderRadius: "8px" }}
              value={newTodo.assignedTo}
              onChange={(value) => setNewTodo({ ...newTodo, assignedTo: value })}
              placeholder="Assigned User"
              allowClear
              options={users.map((u) => ({
                value: u.userName,
                label: (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Avatar size="small" style={{ backgroundColor: getUserColor(u.userName) }}>
                      {u.userName[0].toUpperCase()}
                    </Avatar>
                    {u.userName}
                  </span>
                ),
              }))}
              filterOption={false}
            />
            <AutoComplete
              style={{ width: 120 }}
              value={newTodo.status}
              onChange={(value) => setNewTodo({ ...newTodo, status: value })}
              placeholder="Status"
              allowClear
              options={statuses.map((s) => ({
                value: s.name,
                label: <span style={{ color: s.color, fontWeight: 500 }}>● {s.name}</span>,
              }))}
              filterOption={(inputValue, option) =>
                option.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
            <input
              type="date"
              name="date"
              value={newTodo.date}
              onChange={handleChange}
              style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
            />
            <input
              type="text"
              name="estimatedTime"
              placeholder="Estimated Time"
              value={newTodo.estimatedTime}
              onChange={handleChange}
              style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
            />
            <button
              onClick={handleAddOrEdit}
              style={{
                background: editingTodo ? "#16a34a" : "#2563eb",
                color: "#fff",
                padding: "8px 14px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {editingTodo ? "Save Edit" : "+ Add"}
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div>
          {todos.map((todo) => (
            <div
              key={todo._id}
              style={{
                background: "#fff",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{todo.title}</h3>
                <p style={{ margin: "4px 0" }}>{todo.description}</p>
                <p style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                  Assigned To:{" "}
                  <Avatar size="small" style={{ backgroundColor: getUserColor(todo.assignedTo || "U") }}>
                    {(todo.assignedTo?.[0] || "U").toUpperCase()}
                  </Avatar>{" "}
                  <strong>{todo.assignedTo}</strong>
                </p>
                <p style={{ margin: "4px 0", color: getStatusColor(todo.status), fontWeight: 600 }}>
                  ● {todo.status}
                </p>
                <small>{todo.date} | Est: {todo.estimatedTime}</small>
              </div>
              <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                <Button icon={<EditOutlined />} onClick={() => handleEdit(todo)} />
                <Popconfirm
                  title="Are you sure to delete this todo?"
                  onConfirm={() => handleDeleteTask(todo._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      </Content>
    </Layout>
  );
};

export default Todo;