import React, { useState } from "react";
import TaskLayout from "./layouts";
function PalindromeCrter() {
  const [text, setText] = useState("");
  const inputText = text.toLowerCase().replace(/\W/g, "");
  const reversed = inputText.split("").reverse().join("");
 const isPalindrome = inputText && inputText === reversed;

  return (
    <TaskLayout>
    <div    style={{
          
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
      <h2>Palindrome Checker</h2>

      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "5px", width: "250px" }}
      />

      {text && (
        <h3>
          {isPalindrome ? "Yes, it's a palindrome " : "No, not a palindrome "}
        </h3>
      )}
    </div>
    </TaskLayout>
  );
}

export default PalindromeCrter;
