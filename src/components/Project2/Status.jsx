import React, { useState, useEffect } from "react";
import { Layout, Button, Modal, Input, message, ColorPicker } from "antd";
import axios from "axios";

const { Content } = Layout;

const Status = () => {
  const [statusList, setStatusList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newColor, setNewColor] = useState("#1677ff");
  const [editingStatus, setEditingStatus] = useState(null);

  const API_BASE = "http://localhost:5000/api/statuses";

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(API_BASE);
      setStatusList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error("Failed to fetch statuses");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleAddOrEdit = async () => {
    if (!newStatus.trim()) return message.error("Status cannot be empty");

    try {
      if (editingStatus) {
        await axios.put(`${API_BASE}/${editingStatus._id}`, {
          name: newStatus,
          color: newColor,
        });
        setStatusList(prev =>
          prev.map(s => (s._id === editingStatus._id ? { ...s, name: newStatus, color: newColor } : s))
        );
        message.success("Status updated successfully");
      } else {
        const res = await axios.post(API_BASE, { name: newStatus, color: newColor });
        setStatusList(prev => [res.data, ...prev]);
        message.success("Status added successfully");
      }

      setNewStatus("");
      setNewColor("#1677ff");
      setEditingStatus(null);
      setIsModalVisible(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Error saving status");
      console.error(err.response || err);
    }
  };

  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setNewStatus(status.name || "");
    setNewColor(status.color || "#1677ff");
    setIsModalVisible(true);
  };

  const handleDeleteStatus = async (statusId) => {
    try {
      await axios.delete(`${API_BASE}/${statusId}`);
      setStatusList(prev => prev.filter(s => s._id !== statusId));
      message.success("Status deleted successfully");
    } catch (err) {
      message.error("Error deleting status");
      console.error(err.response || err);
    }
  };

  return (
    <Content style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        {editingStatus ? "Edit Status" : "Add Status"}
      </Button>

      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: "10px" }}>
        {statusList.length === 0 && <p>No statuses found</p>}
        {statusList.map((status) => (
          <div
            key={status._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: "6px",
              background: "#fafafa",
            }}
          >
            <Button
              style={{
                backgroundColor: status.color || "#1677ff",
                color: "#fff",
                border: "none",
                cursor: "default",
              }}
            >
              {status.name || "Unnamed"}
            </Button>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button type="link" onClick={() => handleEditStatus(status)}>
                Edit
              </Button>
              <Button type="link" danger onClick={() => handleDeleteStatus(status._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={editingStatus ? "Edit Status" : "Add Status"}
        open={isModalVisible}
        onOk={handleAddOrEdit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingStatus(null);
          setNewStatus("");
          setNewColor("#1677ff");
        }}
        okText={editingStatus ? "Save" : "Add"}
      >
        <Input
          placeholder="Enter status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <ColorPicker value={newColor} onChange={(c) => setNewColor(c.toHexString())} />
      </Modal>
    </Content>
  );
};

export default Status;