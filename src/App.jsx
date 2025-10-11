 import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContextProvider, useAuth } from "./components/Project2/context/AuthContext";
import Login from "./components/Project2/Auth/Login";
import Register from "./components/Project2/Auth/Register";
import MainLayout from "./components/Project2/MainLayout";
import Chatbot from "./components/Project2/Chatbot";
import ChatPage from "./components/Project2/ChatPage";
import Status from "./components/Project2/Status";
import TaskBoard from "./components/Project2/TaskBoard";
import TaskList from "./components/Project2/TaskList";
import Todo from "./components/Project2/Todo";

// ✅ ProtectedRoute checks token
// const ProtectedRoute = ({ children }) => {
//   const { token } = useAuth();
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// };
const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuth();
  // while restoring auth, don't redirect - show nothing (or a spinner)
  if (isLoading) return null; 
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes under MainLayout */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Default route → redirect to chatbot */}
          <Route index element={<Navigate to="chatbot" replace />} />

          {/* Chatbot page (optional conversationId) */}
          <Route path="chatbot/:conversationId?" element={<Chatbot />} />

          {/* ChatPage → use /app/chat/:conversationId */}
          <Route path="chat/:conversationId?" element={<ChatPage />} />

          {/* Other app pages */}
          <Route path="status" element={<Status />} />
          <Route path="tasks" element={<TaskBoard />} />
          <Route path="tasks/:taskId" element={<TaskList />} />
          <Route path="todo/:todoId" element={<Todo />} />
        </Route>

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthContextProvider>
  );
};

export default App;
