import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) return <Navigate to="/users/me" replace />;

  return children;
};

export default PublicRoute;
