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
      console.log("Failed to parse user from localStorage", err);
      return null;
    }
  });

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("/users/login", data);

      if (res.data.success) {
        const token = res.data.data.accessToken;
        const userData = res.data.data.user;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(userData));
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;

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

    //  Clear auth data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    delete axiosInstance.defaults.headers.common["Authorization"];

    setUser(null);

    // Delete IndexedDB SAFELY
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase("rural-learn-db");

      req.onsuccess = () => {
        console.log("IndexedDB deleted");
        resolve();
      };

      req.onerror = () => {
        console.log("IndexedDB delete failed");
        reject();
      };

      req.onblocked = () => {
        console.warn("IndexedDB delete blocked (close other tabs)");
        resolve();
      };
    });

    //  Clear Cache Storage SAFELY
    if ("caches" in window) {
      const cacheNames = await caches.keys();

      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      console.log("Caches cleared");
    }

    // 4️ Tell Service Worker (Extra safety)
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_CACHE",
      });

      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_SYNC",
      });
    }
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
      console.error("Auth expired — clearing storage");

      localStorage.clear();
      setUser(null);

      const request = indexedDB.deleteDatabase("rural-learn-db");

      request.onsuccess = () => console.log("IndexedDB cleared");
      request.onerror = () => console.log("IndexedDB clear failed");

      if ("caches" in window) {
        caches.keys().then((names) => {
          return Promise.all(names.map((name) => caches.delete(name)));
        });
      }
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
