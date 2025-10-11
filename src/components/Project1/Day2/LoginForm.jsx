import React from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const Login = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Login Values:", values);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        values,
        { withCredentials: true }
      );

      console.log("Login Response:", res.data);

      if (res.status === 200 || res.status === 201) {
        message.success("Login successful!");
        form.resetFields();

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error("Login Error:", err);

      
      if (err.response?.data?.message) {
        message.error(`Error: ${err.response.data.message}`);
      } else {
        message.error("Failed to login. Please try again.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2>LOGIN FORM</h2>

      <Form
        form={form}
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 600,
          boxShadow: "0 4px 8px",
          borderRadius: "20px",
          padding: "20px",
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your Email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your Password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
