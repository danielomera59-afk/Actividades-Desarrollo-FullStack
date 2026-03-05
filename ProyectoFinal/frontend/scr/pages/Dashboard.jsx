import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";

export default function Dashboard() {
  const { role } = useAuth();
  const toast = useToast();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (status) params.set("status", status);

      const res = await api.get(`/commissions?${params.toString()}`);
      setData(res.data.data || []);
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudieron cargar comisiones", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter((c) => {
      const email = String(c.email || "").toLowerCase();
      const desc = String(c.description || "").toLowerCase();
      const id = String(c.id || "");
      const userSeq = String(c.user_seq || "");
      return email.includes(t) || desc.includes(t) || id.includes(t) || userSeq.includes(t);
    });
  }, [data, q]);

  const hasPrev = page > 1;
  const hasNext = data.length === limit;

  const removeCommission = async (id) => {
    if (!confirm("?Eliminar comision? Esta accion no se puede deshacer.")) return;
    try {
      await api.delete(`/commissions/${id}`);
      toast.push("Comision eliminada", "success");
      load();
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo eliminar", "error");
    }
  };

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Listado de comisiones con paginacion, filtro y busqueda.</p>
        </div>
        {role !== "admin" && (
          <Link to="/commissions/new" className="btn btnPrimary">
            + Nueva comision
          </Link>
        )}
      </div>

      <div className="toolbar">
        <div className="tool">
          <span className="toolLabel">Status</span>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">Todos</option>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
        </div>

        <div className="tool grow">
          <span className="toolLabel">Buscar</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="email, descripcion, id o folio" />
        </div>
      </div>

      {loading ? (
        <div className="card pad">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="card pad">
          No hay resultados.
          {role !== "admin" && (
            <>
              {" "}
              <Link to="/commissions/new" className="link">
                Crear una comision
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((c) => {
            const displayNum = role === "admin" ? `#${c.id}` : `#${c.user_seq ?? c.id}`;
            return (
              <div key={c.id} className="card cardItem">
                <div className="cardTop">
                  <div className="cardTitleRow">
                    <div className="cardTitle">Comision {displayNum}</div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="mutedSmall">{c.email}</div>
                </div>

                <div className="cardBody">
                  <p className="descClamp">{c.description}</p>
                </div>

                <div className="cardActions">
                  <Link className="btn btnGhost" to={`/commissions/${c.id}`}>
                    Ver
                  </Link>

                  {role === "admin" && (
                    <>
                      <Link className="btn btnGhost" to={`/commissions/${c.id}/edit`}>
                        Editar
                      </Link>
                      <button className="btn btnDanger" onClick={() => removeCommission(c.id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} setPage={setPage} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
}
