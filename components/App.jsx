import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
// import User from "./components/User";
// import CartTable from "./components/CartTable";
import User from "./components/userForm";
import Login from "./components/Login";
import { Button } from "antd";
import Product from "./components/ProductForm";

function App() {
  const navigate = useNavigate();
  return (
    <div className="layout">
      {/* <User /> */}

      <Button
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </Button>

      <Button
        onClick={() => {
          navigate("/register");
        }}
      >
        register
      </Button>

      <Routes>
        <Route path="/register" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </div>
  );
}
export default App;
