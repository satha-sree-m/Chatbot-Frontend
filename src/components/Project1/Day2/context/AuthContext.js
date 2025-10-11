import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  // ---------- Fetch Logged-in User ----------
  const getPersonalData = async () => {
    if (!token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching personal data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Login ----------
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        }
      );
      const { user } = response.data;
      setUserData(user);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ---------- Signup ----------
  const signup = async ({ firstName, lastName, email, password, phone }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/create",
        {
          userData: { firstName, lastName, email, password, phone },
        }
      );
      const { user } = response.data;
      setUserData(user);
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // ---------- Logout ----------
  const logout = () => {
    Cookies.remove("token");
    setUserData(null);
  };

  useEffect(() => {
    if (!userData) {
      getPersonalData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userData, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);