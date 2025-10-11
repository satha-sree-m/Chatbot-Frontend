import React, { useState } from "react";
import TaskLayout from "./layouts";
const MultTable =() =>{
    const[input, setInput] = useState("");
    const arr=[1,2,3,4,5,6,7,8,9,10];
    const handleChange = (e) => {
          setInput(e.target.value);
    }
return (
    <TaskLayout>
    <div  style={{
          alignItems:"center",
          display:"flex",
          justifyContent:"center",
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
      <label style={{ fontSize: "18px", fontWeight: "bold", marginRight: "10px" }}>
        Enter a Number:
      </label>
      <label>Enter a Number:</label>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}
      
      />
      {input && (
        <>
          <h3>Number: </h3>
          <p>{`${input}`}</p>
          <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "300px"}}>
            <tr>
              <th style={{ padding: "10px", fontSize: "18px" }}>Multiplication Tables</th>
            </tr>

            {arr.map((i) => (
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd", fontSize: "16px" }}>{`${input} × ${i} = ${input * i}`}</td>
              </tr>
            ))}
          </table>
        </>
      )}
    </div>
    </TaskLayout>
    
  );
};

export default MultTable;