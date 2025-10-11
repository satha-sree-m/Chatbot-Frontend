import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const UserForm = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Form Values:", values);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/create",
        values,
        { withCredentials: true }
      );

      console.log("Saved:", res.data);
      form.resetFields();
      message.success("User created successfully!");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error:", err);
      const msg = err.response?.data?.message || "Failed to create user";
      message.error(msg);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{
          maxWidth: 500,
          width: "100%",
          padding: 20,
          boxShadow: "0 4px 8px",
          borderRadius: 12,
        }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "First Name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Last Name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserForm;
