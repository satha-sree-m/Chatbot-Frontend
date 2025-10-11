import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import axios from "axios";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); 


  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      if (res.data && res.data.length > 0) {
        const user = res.data[0]; 
        setUserId(user._id);
        form.setFieldsValue(user);
      }
    } catch (err) {
      console.error("Fetch User Error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (userId) {
       
        await axios.put(`http://localhost:5000/api/users/${userId}`, values, {
          withCredentials: true,
        });
        message.success("Profile updated successfully!");
      } else {
        
        const res = await axios.post(
          "http://localhost:5000/api/users/create",
          values,
          { withCredentials: true }
        );
        setUserId(res.data.data._id);
        message.success("Profile created successfully!");
      }
    } catch (err) {
      console.error("Profile Save Error:", err);
      const msg = err.response?.data?.message || "Failed to save profile";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      form.resetFields();
      setUserId(null);
      message.success("Profile deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      message.error("Failed to delete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>PROFILE</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ firstName: "", lastName: "", email: "", password: "", phone: "" }}
      >
        <Form.Item label="First Name" name="firstName">
          <Input />
        </Form.Item>

        <Form.Item label="Last Name" name="lastName">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Save
          </Button>
        </Form.Item>

        <Form.Item>
          <Button danger onClick={handleDelete} block disabled={loading}>
            Delete Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfilePage;
