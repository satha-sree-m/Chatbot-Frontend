import React from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

const Product = () => {
  const [form] = Form.useForm();
  const token = Cookies.get("token");
  console.log({ token });

  const onFinish = async (values) => {
    console.log("Form Entries:", values);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/products/create",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send cookie token as Bearer
          },
        }
      );
      console.log("Saved:", res.data);
      form.resetFields();
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleValuesChange = (changedValues, allValues) => {
    const { price, quantity } = allValues;
    if (price && quantity) {
      form.setFieldsValue({
        total: parseFloat(price) * parseFloat(quantity),
      });
    } else {
      form.setFieldsValue({ total: "" });
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontFamily: "sans-serif",
          marginBottom: "20px",
        }}
      >
        <h2> Product Details </h2>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{
            maxWidth: 600,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            borderRadius: "8px",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            label="Product Title"
            name="producttitle"
            rules={[{ required: true, message: "Please enter Product Title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter Category!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Please enter Brand!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter Price!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter Quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Total" name="total">
            <Input type="number" disabled />
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "20px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Product;
