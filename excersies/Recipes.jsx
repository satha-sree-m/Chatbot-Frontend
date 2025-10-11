import React, { useEffect, useState } from "react";
import "./RecipeTable.css";
import { Modal, Steps, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [showStepper, setShowStepper] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState({
    name: "",
    prepTimeMinutes: "",
    cookTimeMinutes: "",
    servings: "",
    difficulty: "",
    cuisine: "",
    caloriesPerServing: "",
    tags: "",
    rating: "",
    reviewCount: "",
    mealType: "",
    ingredients: "",
    instructions: "",
    image: "",
  });

useEffect(() => {
  let ignore = false;  

  const loadRecipes = async () => {
    const res = await fetch("http://localhost:3000/getalldata");
    const data = await res.json();
    console.log(data);
    if (!ignore && data?.recipes?.length) {
      setRecipes(data.recipes);
    }
  };

  loadRecipes();

  return () => {
    ignore = true;
  };
}, []);




  const handleAddOrEditRecipe = () => {
    console.log({ data: formData });

    const updatedRecipe = {
      id: isEditMode ? recipes[editIndex].id : recipes.length + 1,
      ...formData,
    };

    let updatedList = [...recipes];
    if (isEditMode) {
      updatedList[editIndex] = updatedRecipe;
      messageApi.success("Recipe updated successfully!");
    } else {
      updatedList.push(updatedRecipe);
      messageApi.success("New recipe added!");
    }

    setRecipes(updatedList);
    resetForm();
  };

  const resetForm = () => {
    setShowStepper(false);
    setCurrentStep(0);
    setEditIndex(null);
    setIsEditMode(false);
    setFormData({
      name: "",
      prepTimeMinutes: "",
      cookTimeMinutes: "",
      servings: "",
      difficulty: "",
      cuisine: "",
      caloriesPerServing: "",
      tags: [],
      rating: "",
      reviewCount: "",
      mealType: "",
      ingredients: "",
      instructions: "",
      image: "",
    });
  };

  const handleEdit = (index) => {
    const item = recipes[index];
    message.success("Recipe updated successfully!");
    setFormData({
      name: item?.name,
      prepTimeMinutes: item?.prepTimeMinutes,
      cookTimeMinutes: item?.cookTimeMinutes,
      servings: item?.servings,
      difficulty: item.difficulty,
      cuisine: item?.cuisine,
      caloriesPerServing: item?.caloriesPerServing,
      tags: [],
      rating: item?.rating,
      reviewCount: item?.reviewCount,
      mealType: item?.mealType,
      ingredients: item?.ingredients.join(", "),
      instructions: item?.instructions.join(", "),
      image: item?.image,
    });
    setEditIndex(index);
    setIsEditMode(true);
    setShowStepper(true);
    setCurrentStep(0);
  };

  const handleDelete = (index) => {
  if (window.confirm("Are you sure you want to delete this recipe?")) {
    const updatedList = [...recipes];
    updatedList.splice(index, 1);
    setRecipes(updatedList);
    messageApi.success("Recipe deleted successfully!");
  }
};
const navigate = useNavigate();
const handleRowClick = (item) => {
  navigate(`/user/${item.id}`);
};


  return (
    <div className="table-container">
      {contextHolder}
      <div
        className="table-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2>Recipe Table</h2>
        <button
          className="add-button"
          onClick={() => setShowStepper(true)}
          style={{
            position: "fixed",
            marginBottom: "10px",
            marginTop: "10px",
            right: "10px",
          }}
        >
          Add Item
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th style={{ padding: "20px" }}>ID</th>
            <th>Name</th>
            <th>Prep Time</th>
            <th>Cook Time</th>
            <th>Servings</th>
            <th>Difficulty</th>
            <th>Cuisine</th>
            <th>Calories</th>
            <th>Tags</th>
            <th>Rating</th>
            <th>Review Count</th>
            <th>Meal Type</th>
            <th>Ingredients</th>
            <th>Instructions</th>
            <th>Food Ref</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {recipes?.length > 0 ? (
            recipes?.map((item, index) => (
              <tr
                key={index}
                onClick={async () => {
                  handleRowClick(item);
                }}
              >
                <td>{item?.id}</td>
                <td>{item?.name || "-"}</td>
                <td>{item?.prepTimeMinutes || 0}</td>
                <td>{item?.cookTimeMinutes || 0}</td>
                <td>{item?.servings || 0}</td>
                <td>{item?.difficulty || "-"}</td>
                <td>{item?.cuisine || "-"}</td>
                <td>{item?.caloriesPerServing || 0}</td>
                <td>
                  <table>
                    <tbody>
                      {item?.tags?.length
                        ? item?.tags?.map((tag, i) => (
                            <tr key={i}>
                              <td style={{ textAlign: "center" }}>{tag}</td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </td>
                <td>{item?.rating || 0}</td>
                <td>{item?.reviewCount || 0}</td>
                <td>{item?.mealType || "-"}</td>
                <td>
                  <table>
                    <tbody>
                      {item?.ingredients?.length
                        ? item?.ingredients?.map((ing, i) => (
                            <tr key={i}>
                              <td style={{ textAlign: "center" }}>{ing}</td>
                            </tr>
                          ))
                        : "-"}
                    </tbody>
                  </table>
                </td>
                <td>
                  <table>
                    <tbody>
                      {item?.instructions?.length
                        ? item?.instructions?.map((inst, i) => (
                            <tr key={i}>
                              <td style={{ textAlign: "center" }}>{inst}</td>
                            </tr>
                          ))
                        : "-"}
                    </tbody>
                  </table>
                </td>
                <td>
                  {item?.image ? (
                    <img src={item?.image} width="50" height="50" />
                  ) : null}
                </td>
                <td>
                  <Button type="link" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="16" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        title={isEditMode ? "Edit Recipe" : "Add New Recipe"}
        open={showStepper}
        footer={null}
        onCancel={resetForm}
      >
        <Steps current={currentStep}>
          <Step title="Basic Info" />
          <Step title="Tags & Meal" />
          <Step title="Full Recipe" />
        </Steps>

        <div style={{ marginTop: 20 }}>
          {currentStep === 0 && (
            <div className="step">
              <label>
                Name:{" "}
                <input
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Prep Time (mins):{" "}
                <input
                  type="number"
                  value={formData?.prepTimeMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prepTimeMinutes: e?.target?.value,
                    })
                  }
                />
              </label>
              <br />
              <label>
                Cook Time (mins):{" "}
                <input
                  type="number"
                  value={formData?.cookTimeMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cookTimeMinutes: e?.target?.value,
                    })
                  }
                />
              </label>
              <br />
              <label>
                Servings:{" "}
                <input
                  type="number"
                  value={formData?.servings}
                  onChange={(e) =>
                    setFormData({ ...formData, servings: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Difficulty:{" "}
                <input
                  value={formData?.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Cuisine:{" "}
                <input
                  value={formData?.cuisine}
                  onChange={(e) =>
                    setFormData({ ...formData, cuisine: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Calories:{" "}
                <input
                  type="number"
                  value={formData?.caloriesPerServing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caloriesPerServing: e?.target?.value,
                    })
                  }
                />
              </label>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step">
              <label>
                Tags (comma-separated):{" "}
                <input
                  value={formData?.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Rating:{" "}
                <input
                  type="number"
                  step="0.1"
                  value={formData?.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Review Count:{" "}
                <input
                  type="number"
                  value={formData?.reviewCount}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewCount: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Meal Type:{" "}
                <input
                  value={formData?.mealType}
                  onChange={(e) =>
                    setFormData({ ...formData, mealType: e?.target?.value })
                  }
                />
              </label>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step">
              <label>
                Ingredients (comma-separated):{" "}
                <textarea
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Instructions (comma-separated):{" "}
                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e?.target?.value })
                  }
                />
              </label>
              <br />
              <label>
                Food Ref (Image URL):{" "}
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e?.target?.value })
                  }
                />
              </label>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          )}
          {currentStep < 2 && (
            <Button
              type="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          )}
          {currentStep === 2 && (
            <Button type="primary" onClick={handleAddOrEditRecipe}>
              {isEditMode ? "Update" : "Submit"}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Recipes;