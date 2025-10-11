import { useState } from "react";
import TaskLayout from "./layouts";
const Settings = () => {
  const [features, setFeatures] = useState({
    darkTheme: false,
    betaAccess: false,
  });

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const enableAllFeatures = () =>
    setFeatures({ darkTheme: true, betaAccess: true });

  const disableAllFeatures = () =>
    setFeatures({ darkTheme: false, betaAccess: false });

  return (
    <TaskLayout>
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        maxWidth: 300,
        margin: "auto",
      }}
    >
      <h2>Feature Settings</h2>

     
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <input
            type="checkbox"
            name="darkTheme"
            checked={features.darkTheme}
            onChange={handleFeatureChange}
          />
          <label style={{ marginLeft: "5px" }}>Dark Theme</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="betaAccess"
            checked={features.betaAccess}
            onChange={handleFeatureChange}
          />
          <label style={{ marginLeft: "5px" }}>Beta Access</label>
        </div>
      </div>

     
      <p style={{ marginTop: "15px" }}>
        Enabled: {Object.values(features).filter(Boolean).length}/2
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <button onClick={enableAllFeatures}>Enable All</button>
        <button onClick={disableAllFeatures}>Disable All</button>
      </div>
    </div>
    </TaskLayout>
  );
};

export default Settings;
