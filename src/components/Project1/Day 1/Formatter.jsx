import React, { useState } from "react";
import TaskLayout from "./layouts";
const UsernameFormatter = () => {
  const [name, setName] = useState("");


  const formatUsername = (text) => {
    return text
      .trim()                        
      .toLowerCase()                 
      .replace(/\s+/g, "_")        
      .replace(/[^\w]/g, "");        
  };

  const username = formatUsername(name);

  return (
    <TaskLayout>
    <div   style={{
          
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
      <h2>Username Formatter</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "8px", width: "250px" }}
      />
      <div style={{ marginTop: "20px" }}>
        <p><strong>Formatted Username:</strong> {username}</p>
        <p><strong>Character Count:</strong> {username.length}</p>
      </div>
    </div>
    </TaskLayout>
  );
};

export default UsernameFormatter;
