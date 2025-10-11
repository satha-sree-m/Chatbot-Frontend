import React from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        message.success("Login successful!");
        form.resetFields();

         
        navigate("/app/chatbot", { replace: true });
      } else {
        message.error(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Something went wrong. Please try again.");
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
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Login</h2>

      <Form
        form={form}
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          padding: "24px",
          background: "#fff",
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

        <p
          style={{
            margin: "0",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </p>
      </Form>
    </div>
  );
};

export default Login;