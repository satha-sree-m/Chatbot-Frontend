import React, { useState } from "react";
import TaskLayout from "./layouts";

const Dice = () => {
  const [rolls, setRolls] = useState([]);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const newRolls = [...rolls, roll];
    setRolls(newRolls);
    console.log("All Rolls:", newRolls);
  };

  let min = 0, max = 0, avg = 0;
  if (rolls.length > 0) {
    min = Math.min(...rolls);
    max = Math.max(...rolls);
    avg = (rolls.reduce((sum, val) => sum + val, 0) / rolls.length).toFixed(2);
  }

  return (
    <TaskLayout>
      <div
        style={{
          display:"flex",
          justifyContent:"center",
         alignItems: "center",}}
      >
        <div
          style={{
          minHeight: "90vh", 
           
            background: "white",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Dice Roller </h2>
          <button onClick={rollDice}>Roll the dice</button>

          <h3>Min: {min}</h3>
          <h3>Max: {max}</h3>
          <h3>Avg: {avg}</h3>
        </div>
      </div>
    </TaskLayout>
  );
};

export default Dice;
