import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./components/Project2/context/AuthContext";
import { SocketProvider } from "./components/Project2/context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
        </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
