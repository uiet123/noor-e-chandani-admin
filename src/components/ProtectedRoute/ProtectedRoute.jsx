import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const admin = useSelector((state) => state.admin.admin);

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />
};

export default ProtectedRoute;
