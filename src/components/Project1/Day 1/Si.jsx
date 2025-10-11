import React, { useState } from "react";
import TaskLayout from "./layouts";
const InterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [n, setN] = useState("");


  const simpleInterest =
    principal && rate && time
      ? ((principal * rate * time) / 100).toFixed(2)
      : null;

  
  const compoundInterest =
    principal && rate && time && n
      ? (
          principal * Math.pow(1 + rate / (100 * n), n * time) - principal
        ).toFixed(2)
      : null;

  return (
    <TaskLayout>
    <div    style={{alignItems:"center",
          display:"flex",
          justifyContent:"center",
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
      <h2>Interest Calculator</h2>

      <input
        type="number"
        placeholder="Principal (P)"
        value={principal}
        onChange={(e) => setPrincipal(Number(e.target.value))}
        style={{ margin: "5px" }}
      />

      <input
        type="number"
        placeholder="Rate (%)"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        style={{ margin: "5px" }}
      />

      <input
        type="number"
        placeholder="Time (years)"
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
        style={{ margin: "5px" }}
      />

      <input
        type="number"
        placeholder="Compounds per year (n)"
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
        style={{ margin: "5px" }}
      />


      {compoundInterest ? (
        <h3>Compound Interest = ₹{compoundInterest}</h3>
      ) : simpleInterest ? (
        <h3>Simple Interest = ₹{simpleInterest}</h3>
      ) : null}
    </div>
    </TaskLayout>
  );
};

export default InterestCalculator;
