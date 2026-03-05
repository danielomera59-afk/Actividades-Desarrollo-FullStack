import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../components/Toast";

export default function EditCommission() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/commissions/${id}`);
      const c = res.data;
      setEmail(c.email || "");
      setDescription(c.description || "");
      setStatus(c.status || "pending");
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo cargar", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("email", email);
      fd.append("description", description);
      fd.append("status", status);
      if (file) fd.append("referenceImage", file);

      await api.put(`/commissions/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.push("Actualizado ✅", "success");
      nav(`/commissions/${id}`);
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo actualizar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Editar comisión #{id}</h1>
          <p className="muted">Admin: puedes actualizar datos, status e imagen.</p>
        </div>
        <Link className="btn btnGhost" to={`/commissions/${id}`}>← Volver</Link>
      </div>

      <div className="card pad">
        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="field">
            <span>Descripción</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
          </label>

          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">pending</option>
              <option value="accepted">accepted</option>
              <option value="rejected">rejected</option>
            </select>
          </label>

          <label className="field">
            <span>Nueva imagen (opcional)</span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <button className="btn btnPrimary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}