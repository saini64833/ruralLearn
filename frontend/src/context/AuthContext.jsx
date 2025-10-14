import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const res = await axiosInstance.post("/users/login", data);
    localStorage.setItem("accessToken", res.data.data.accessToken);
    setUser(res.data.data.user);
  };

  const logout = async () => {
    await axiosInstance.post("/users/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
