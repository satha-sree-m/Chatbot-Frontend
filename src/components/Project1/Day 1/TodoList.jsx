import React, { useState } from "react";
import TaskLayout from "./layouts";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input.trim(), done: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos
    .filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    )
    .filter((todo) => {
      if (filter === "pending") return !todo.done;
      if (filter === "completed") return todo.done;
      return true;
    });

  return (
    <TaskLayout>
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          
          margin: "20px auto",
        }}
      >
        <div style={{ width: "100%" }}>
          <h2 style={{  marginBottom: 15, color: "#333" }}>
            To Do List
          </h2>

          <div
            style={{
              marginBottom: 10,
             
              gap: "5px",
             
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a todo"
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
               
              }}
            />
            <button
              onClick={addTodo}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#4CAF50",
                color: "white",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>

          <div
            style={{
              
              gap: "10px",
              marginBottom: 15,
              
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search todos"
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                
              }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                background: "white",
              }}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              
              margin: 0,
            }}
          >
            {filteredTodos.length === 0 ? (
              <p style={{ color: "#888" }}>No todos found</p>
            ) : (
              filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    marginBottom: 8,
                    
                    background: "#f9f9f9",
                    padding: "6px 10px",
                    borderRadius: 6,
                    
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span
                      style={{
                        marginLeft: 8,
                        textDecoration: todo.done ? "line-through" : "none",
                        color: todo.done ? "#888" : "#333",
                      }}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      marginLeft: 10,
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#e74c3c",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </TaskLayout>
  );
};

export default TodoApp;
