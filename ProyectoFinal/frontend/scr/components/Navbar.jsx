import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Navbar() {
  const { isAuthenticated, role, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [counts, setCounts] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    let alive = true;

    async function loadCounts() {
      if (!isAuthenticated) return;
      try {
        const res = await api.get("/commissions/summary");
        if (alive) setCounts(res.data);
      } catch {
        // si falla, no pasa nada
      }
    }

    loadCounts();
    return () => { alive = false; };
  }, [isAuthenticated, location.pathname]);

  return (
    <header className="navBar">
      <div className="navInner">
        <Link className="brand" to="/">
          <span className="brandDot" />
          <span>ProyectoFinal</span>
        </Link>

        <nav className="navLinks">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                Dashboard
              </NavLink>
              {role !== "admin" && (
                <NavLink to="/commissions/new" className={({ isActive }) => (isActive ? "active" : "")}>
                  Nueva comision
                </NavLink>
              )}
              {role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                  Admin
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                Registro
              </NavLink>
            </>
          )}
        </nav>

        <div className="navRight">
          {isAuthenticated ? (
            <>
              <div className="pill" title="Conteo de comisiones visibles para tu rol">
                <span className="pillStrong">{username || "usuario"}</span>
                <span className="pillMuted">{role}</span>
                <span className="pillMuted">•</span>
                <span className="pillMuted">{counts.total} comisiones</span>
              </div>
              <button className="btn btnGhost" onClick={onLogout}>
                Salir
              </button>
            </>
          ) : (
            <span className="mutedSmall">Sin sesión</span>
          )}
        </div>
      </div>
    </header>
  );
}
