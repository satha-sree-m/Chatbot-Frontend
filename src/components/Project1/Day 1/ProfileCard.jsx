import React, { useState } from "react";
import TaskLayout from "./layouts";
const ProfileCard = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  });

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value, 
    }));
  };


  const isValidAge = profile.age >= 0;
  const isValidEmail = profile.email.includes("@");

  return (
    <TaskLayout>
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Profile Card Builder</h2>

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={profile.firstName}
        onChange={handleChange}
        style={{ margin: "5px" }}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={profile.lastName}
        onChange={handleChange}
        style={{ margin: "5px" }}
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={profile.age}
        onChange={handleChange}
        style={{ margin: "5px" }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={profile.email}
        onChange={handleChange}
        style={{ margin: "5px" }}
      />

    <div    style={{
          
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
        <h2>Profile Data</h2>
        <p>
          <strong>Full Name:</strong> {fullName || ""}
        </p>
        <p>
          <strong>Age:</strong> {isValidAge ? profile.age : "Invalid age"}
        </p>
        <p>
          <strong>Email:</strong> {isValidEmail ? profile.email : "Invalid email"}
        </p>
      </div>

    </div>
    </TaskLayout>
  );
};

export default ProfileCard;
