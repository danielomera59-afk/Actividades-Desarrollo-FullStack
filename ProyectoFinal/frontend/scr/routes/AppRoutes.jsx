import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleGuard from "../components/RoleGuard";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CommissionForm from "../pages/CommissionForm";
import CommissionDetail from "../pages/CommissionDetail";
import EditCommission from "../pages/EditCommission";
import AdminPanel from "../pages/AdminPanel";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/commissions/new"
        element={
          <ProtectedRoute>
            <RoleGuard allow={["user"]}>
              <CommissionForm />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/commissions/:id"
        element={
          <ProtectedRoute>
            <CommissionDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/commissions/:id/edit"
        element={
          <ProtectedRoute>
            <RoleGuard allow={["admin"]}>
              <EditCommission />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleGuard allow={["admin"]}>
              <AdminPanel />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
