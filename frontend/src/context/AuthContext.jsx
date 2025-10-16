import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("/users/login", data);
      if (res.data.success) {
        const token = res.data.data.accessToken;
        localStorage.setItem("accessToken", token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(res.data.data.user);
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setUser(null);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const res = await axiosInstance.get("/users/me");
      setUser(res.data.message); // user object is in message
    } catch (err) {
      console.error("Failed to fetch user:", err.response?.data || err.message);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
