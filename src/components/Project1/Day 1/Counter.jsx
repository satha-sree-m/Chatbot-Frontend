import React, { useState } from "react";
import TaskLayout from "./layouts";
 const TaskCounter= ()=> {
    const[count,setcount]=useState(0);

    const handleIncrement = () =>{
        setcount(count+1);
    }

    const handleDecrement = () =>{
        setcount(Math.max(count-1,0));
    }

    const handleReset = () =>{
        setcount(0);
    }


return (
  <TaskLayout>
  <div
  >
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",        // centers text inside the box
      }}
    >
      <h2>Counter: {count}</h2>
      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleDecrement} disabled={count === 0}>
        -1
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  </div>
  </TaskLayout>
);

  };
  export default TaskCounter;