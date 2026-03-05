/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");

  const isAuthenticated = !!token;

  const login = async ({ username, password }) => {
    const res = await api.post("/auth/login", { username, password });
    const newToken = res.data.token;
    const newRole = res.data.role;

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("username", username);

    setToken(newToken);
    setRole(newRole);
    setUsername(username);

    return { token: newToken, role: newRole };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setToken("");
    setRole("");
    setUsername("");
  };

  // Helpers Ãºtiles
  const register = async ({ username, password, role }) => {
    return api.post("/auth/register", { username, password, role });
  };

  const value = useMemo(
    () => ({ token, role, username, isAuthenticated, login, logout, register }),
    [token, role, username, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
