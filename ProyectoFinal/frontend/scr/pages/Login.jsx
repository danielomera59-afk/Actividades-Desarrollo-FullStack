import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import api from "../services/api";

const DEMOS = [
  { username: "admin", password: "123456", role: "admin" },
  { username: "user1", password: "123456", role: "user" },
  { username: "user2", password: "123456", role: "user" },
  { username: "user3", password: "123456", role: "user" },
];

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login({ username, password });
      toast.push("Sesión iniciada ✅", "success");
      nav("/dashboard");
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo iniciar sesión", "error");
    } finally {
      setLoading(false);
    }
  };

  const createDemoAccounts = async () => {
    try {
      setLoading(true);
      for (const acc of DEMOS) {
        try {
          await api.post("/auth/register", acc);
        } catch (e) {
          // 409 = ya existe (ok)
          if (e?.response?.status !== 409) throw e;
        }
      }
      toast.push("Cuentas demo listas ✅ (admin/user1/user2/user3)", "success");
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudieron crear cuentas demo", "error");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
  };

  return (
    <div className="page">
      <div className="card authCard">
        <div className="cardHeader">
          <h1>Iniciar sesión</h1>
          <p className="muted">
            Accede con tu usuario. Si es tu primera vez, usa <Link to="/register">Registro</Link> o crea cuentas demo.
          </p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span>Usuario</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              type="password"
            />
          </label>

          <button className="btn btnPrimary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="splitRow">
            <button type="button" className="btn btnGhost" onClick={createDemoAccounts} disabled={loading}>
              Crear cuentas demo
            </button>
            <Link className="btn btnGhost" to="/register">
              Ir a registro
            </Link>
          </div>

          <div className="divider" />

          <div className="demoGrid">
            {DEMOS.map((d) => (
              <button
                key={d.username}
                type="button"
                className="btn btnSoft"
                onClick={() => quickLogin(d)}
                disabled={loading}
                title="Rellena el form con esta cuenta"
              >
                {d.username} <span className="mutedSmall">({d.role})</span>
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}