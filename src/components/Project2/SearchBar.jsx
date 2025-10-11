import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search users..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "8px",
        marginBottom: "10px",
        fontSize: "16px",
        boxShadow: "0 0 2px",
        backgroundColor: "#f6f5f4",
        outline: "#1daa61 1px solid",
      }}
    />
  );
}

export default SearchBar;
