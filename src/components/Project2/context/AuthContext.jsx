 import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true); // important to block routing until restored

  // keep axios default auth header in sync
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      Cookies.set("token", token, { expires: 1 });
      if (user) Cookies.set("user", JSON.stringify(user), { expires: 1 });
    } else {
      delete axios.defaults.headers.common["Authorization"];
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(null);
    }
  }, [token, user]);

  // On mount: if token exists, validate it and fetch user profile
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      const t = Cookies.get("token");
      if (!t) {
        setIsLoading(false);
        return;
      }
      try {
        // set header for initial request
        axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        const res = await axios.get("http://localhost:5000/api/auth/me");
        if (!cancelled && res.data) {
          setToken(t);
          setUser(res.data);
        }
      } catch (err) {
        console.error("Auth restore failed:", err?.response?.data || err.message);
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
        Cookies.remove("token");
        Cookies.remove("user");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    restore();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      if (res.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, token: res.data.token, user: res.data.user };
      } else {
        return { success: false, message: res.data?.msg || "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.msg || "Server error during login" };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", userData);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.msg || "Signup failed" };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    Cookies.remove("token");
    Cookies.remove("user");
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, login, signup, logout, isLoggedIn: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
