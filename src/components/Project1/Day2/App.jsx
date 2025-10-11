import { Route, Routes } from "react-router-dom";
import { AuthContextProvider, useAuth } from "./context/AuthContext";
import Register from "./RegisterForm";
import Login from "./Login";
import ProductForm from "./ProductForm";

// ---------- Protected Route ----------
const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const UserManagement = () => {
  const userData = useAuth();

  const mernStackConfig = [
    {
      key: "",
      label: "",
      path: "/register",
      component: Register,
      protected: userData ? true : false,
    },
    {
      key: "",
      label: "",
      path: "/login",
      component: Login,
      protected: userData ? true : false,
    },
    {
      key: "",
      label: "",
      path: "/product",
      component: ProductForm,
      protected: userData ? true : false,
    },
  ];
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          {mernStackConfig.map((x) => {
            const Component = x.component;
            return (
              <Route
                key={x.key}
                path={x.path}
                element={
                  x.protected ? (
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  ) : (
                    <Component />
                  )
                }
              />
            );
          })}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
};

export default UserManagement;


// import { Route, Routes } from "react-router-dom";
// import taskConfig from "./components/config/TaskConfig"

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         {Array.isArray(taskConfig) && taskConfig.length ? (
//           taskConfig.map((x) => {
//             const Component = x.component;
//             return <Route key={x.key} path={x.path} element={<Component />} />;
//           })
//         ) : (
//           <Route path="*" element={<div>Not Found</div>} />
//         )}
//       </Routes>
//     </div>
//   );
// };


// export default App; //already existed backup//


//running code for main app.jsx//

//day2//

// import React, { useState } from "react";
// import LoginForm from "./components/Day2/LoginForm";
// import UserForm from "./components/Day2/userForm";
// import RecipeForm from "./components/Day2/RecipeForm";
// import ProfilePage from "./components/Day2/ProfilePage";
// import { Button } from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";

// export default function App() {
//   const [currentForm, setCurrentForm] = useState(null); 
//   const [userLoggedIn, setUserLoggedIn] = useState(false);

//   const handleLoginSuccess = () => {
//     setUserLoggedIn(true);
//     setCurrentForm("recipe"); 
//   };

//   const handleRegisterSuccess = () => {
//     setUserLoggedIn(true);
//     setCurrentForm("recipe"); 
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       {!userLoggedIn && (
//         <div style={{ marginBottom: "20px" }}>
//           <Button type="primary" onClick={() => setCurrentForm("login")}>
//             Login
//           </Button>
//           <Button
//             type="default"
//             style={{ marginLeft: "10px" }}
//             onClick={() => setCurrentForm("register")}
//           >
//             Register
//           </Button>
//         </div>
//       )}

//       {userLoggedIn && (
//         <div style={{ marginBottom: "20px" }}>
//           <FontAwesomeIcon
//             icon={faUser}
//             style={{ fontSize: "40px", cursor: "pointer" }}
//             onClick={() => setCurrentForm("profile")}
//           />
//         </div>
//       )}

//       <div>
//         {currentForm === "login" && <LoginForm onSuccess={handleLoginSuccess} />}
//         {currentForm === "register" && <UserForm onSuccess={handleRegisterSuccess} />}
//         {currentForm === "recipe" && <RecipeForm />}
//         {currentForm === "profile" && <ProfilePage />}
//       </div>
//     </div>
//   );
// }

