import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ allow = ["admin"], children }) {
  const { role } = useAuth();

  if (!allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}