import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Register() {
  const nav = useNavigate();
  const toast = useToast();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("123456");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register({ username, password, role });
      toast.push("Usuario registrado ✅ Ahora inicia sesión.", "success");
      nav("/login");
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo registrar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card authCard">
        <div className="cardHeader">
          <h1>Registro</h1>
          <p className="muted">
            Crea un usuario para probar. <Link to="/login">Volver a login</Link>
          </p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span>Usuario</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="user_nuevo" />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </label>

          <label className="field">
            <span>Rol</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <span className="mutedSmall">Tip: usa admin solo para pruebas del panel admin.</span>
          </label>

          <button className="btn btnPrimary" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}