import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("/users/login", data);
      if (res.data.success) {
        const accessToken = res.data.data.accessToken;
        const userData = res.data.data.user;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        setUser(userData);
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return setUser(null);

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
    try {
      const res = await axiosInstance.get("/users/me");
      setUser(res.data?.data);
      localStorage.setItem("user", JSON.stringify(res.data?.data));
    } catch (err) {
      console.log(
        "Failed to fetch user:",
        err.response?.message || err.message
      );
      setUser(null);
      localStorage.removeItem("user");
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
