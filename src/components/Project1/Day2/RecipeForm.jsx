import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import axios from "axios";

const RecipeForm = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Recipe Values:", values);

    try {
      
      const res = await axios.post(
        "http://localhost:5000/api/recipes/create",
        values,  
        { withCredentials: true }
      );

      console.log("Recipe Created:", res.data);
      message.success("Recipe created successfully!");
      form.resetFields();

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Recipe Creation Error:", err);
      const msg = err.response?.data?.message || "Failed to create recipe. Please try again.";
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
          width: 500,
          padding: 20,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          borderRadius: 20,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Add Recipe</h2>

        <Form.Item label="Recipe Name" name="recipename">
          <Input />
        </Form.Item>

        <Form.Item label="Cuisine" name="cuisine">
          <Input />
        </Form.Item>

        <Form.Item label="Meal Type" name="mealtype">
          <Input />
        </Form.Item>

        <Form.Item label="Servings" name="servings">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Review Count" name="reviewcount">
          <InputNumber style={{ width: "100%" }} />
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

export default RecipeForm;
