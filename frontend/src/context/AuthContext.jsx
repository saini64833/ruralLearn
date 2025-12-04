import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");

      if (!saved || saved === "undefined" || saved === "null") {
        return null;
      }

      return JSON.parse(saved);
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  });

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("/users/login", data);

      if (res.data.success) {
        const token = res.data.data.accessToken;
        const userData = res.data.data.user;

        // Store securely
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Set axios default header
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        setUser(userData);
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };
  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (err) {
      console.log("Logout API failed:", err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setUser(null);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const res = await axiosInstance.get("/users/me");

      const currentUser = res.data?.data;

      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (err) {
      console.error("Failed to fetch current user", err);

      localStorage.removeItem("user");
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
