import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      if (res.success) {
        form.resetFields();
        message.success("User created successfully!");
        navigate("/login");
      } else {
        message.error(res.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        message.error(err.response.data?.message || "Failed to create user");
      } else {
        message.error("Failed to create user. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "50px",
      }}
    >
      <h2>User Registration</h2>

      <Form
        form={form}
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, padding: "20px", boxShadow: "0 4px 8px", borderRadius: "20px" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please enter your First Name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please enter your Last Name!" }]}
        >
          <Input />
        </Form.Item>

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

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter your Phone Number!" }]}
        >
          <Input type="tel" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>

        <p style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </Form>
    </div>
  );
};

export default Register;