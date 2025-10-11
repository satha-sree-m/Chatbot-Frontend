import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Button } from "antd";
import "./UserTable.css";

function Recipe() {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const getRecipeById = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getData/${id}`);
      const data = await response.json();
      const dat = data?.data?.[0];
      if (dat) {
        setRecipeData(dat);
        form.setFieldsValue({
          id: dat.id,
          name: dat.name,
          prepTimeMinutes: dat.prepTime,
          cookTimeMinutes: dat.cookTime,
          servings: dat.servings,
          difficulty: dat.difficulty,
          cuisine: dat.cuisine,
          caloriesPerServing: dat.calories,
          tags: dat.tags,
          rating: dat.rating,
          reviewCount: dat.reviewCount,
          mealType: dat.mealType,
          ingredients: dat.ingredients,
          instructions: dat.instructions,
          image: dat.foodRef,
        });
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSave = () => {
    const updatedValues = form.getFieldsValue();
    console.log("Updated Recipe Data:", updatedValues);
    setRecipeData((prev) => ({ ...prev, ...updatedValues }));
    setIsEditing(false);
  };

  useEffect(() => {
    getRecipeById();
  }, []);

  return (
    <div className="card">
      <Card
        title="Recipe Data"
        bordered={false}
        style={{
          width: 400,
          boxShadow:
            "rgb(85, 91, 255) 0px 0px 0px 3px, " +
            "rgb(31, 193, 27) 0px 0px 0px 6px, " +
            "rgb(255, 217, 19) 0px 0px 0px 9px, " +
            "rgb(255, 156, 85) 0px 0px 0px 12px, " +
            "rgb(255, 85, 85) 0px 0px 0px 15px",
        }}
      >
        <Form form={form}>
          <Form.Item label="Id" name="id">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Recipe Name" name="name">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Prep Time" name="prepTimeMinutes">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Cook Time" name="cookTimeMinutes">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Servings" name="servings">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Difficulty" name="difficulty">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Cuisine" name="cuisine">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Calories" name="caloriesPerServing">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Rating" name="rating">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Review Count" name="reviewCount">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Meal Type" name="mealType">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Ingredients" name="ingredients">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Instructions" name="instructions">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Food Ref" name="image">
            <Input disabled={!isEditing} />
          </Form.Item>

          <Form.Item>
            {isEditing ? (
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button onClick={handleEditClick}>Edit</Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Recipe;