import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function ProtectRoutes({ children }) {
  // Check if token exists in local storage
  const token = localStorage.getItem("token");

  // If token exists, render the children (i.e., allow access), otherwise redirect to login
  return token ? children : <Navigate to="/login" />;
}

export default ProtectRoutes;
