import React from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const User = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Form Values:", values);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/create",
        { userData: values },
        {
          withCredentials: true,
        }
      );

      console.log("Saved:", res.data);
      form.resetFields();
      message.success("User created successfully!");
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        message.error(
          `Error: ${err.response.data?.message || "Failed to create user"}`
        );
      } else {
        message.error("Failed to create user. Please try again.");
      }
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
      }}
    >
      <h2>USER FORM</h2>

      <Form
        form={form}
        name="basic"
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
          rules={[{ required: true, message: "Please enter your Email-ID!" }]}
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
          rules={[
            { required: true, message: "Please enter your Phone Number!" },
          ]}
        >
          <Input type="tel" />
        </Form.Item>
        <Form.Item label={null} wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default User;
