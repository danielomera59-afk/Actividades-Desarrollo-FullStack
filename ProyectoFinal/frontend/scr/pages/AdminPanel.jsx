import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";

export default function AdminPanel() {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({ pending: 0, accepted: 0, rejected: 0, revenue_mxn: 0 });

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", "1");
    p.set("limit", "50");
    if (status) p.set("status", status);
    if (q.trim()) p.set("q", q.trim());
    return p.toString();
  }, [status, q]);

  const load = async () => {
    try {
      setLoading(true);

      // listado
      const res = await api.get(`/commissions?${params}`);
      setRows(res.data.data || []);

      // resumen (si existe endpoint)
      try {
        const s = await api.get("/admin/summary");
        setSummary(s.data || summary);
      } catch {
        // si no existe, ignora
      }
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudieron cargar comisiones", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const setRowStatus = async (id, s) => {
    try {
      await api.patch(`/commissions/${id}/status`, { status: s });
      toast.push(`Status #${id} → ${s} ✅`, "success");
      load();
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo cambiar status", "error");
    }
  };

  const remove = async (id) => {
    if (!confirm(`¿Eliminar comisión #${id}?`)) return;
    try {
      await api.delete(`/commissions/${id}`);
      toast.push("Eliminada ✅", "success");
      load();
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo eliminar", "error");
    }
  };

  const exportCSV = async () => {
    try {
      const res = await api.get("/admin/commissions/export", {
        params: { status: status || undefined, q: q.trim() || undefined },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "commissions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.push("CSV descargado ✅", "success");
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo exportar CSV", "error");
    }
  };

  const money = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return "—";
    return `$${n.toFixed(2)} MXN`;
  };

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Panel Admin</h1>
          <p className="muted">Resumen, búsqueda, filtro, export CSV y acciones rápidas.</p>
        </div>

        <div className="rowGap">
          <button className="btn btnGhost" onClick={exportCSV}>
            Export CSV
          </button>
          <button className="btn btnGhost" onClick={load}>
            Refrescar
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="card pad">
          <div className="mutedSmall">Pending</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{summary.pending ?? 0}</div>
        </div>
        <div className="card pad">
          <div className="mutedSmall">Accepted</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{summary.accepted ?? 0}</div>
        </div>
        <div className="card pad">
          <div className="mutedSmall">Rejected</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{summary.rejected ?? 0}</div>
        </div>
        <div className="card pad">
          <div className="mutedSmall">Revenue (MXN)</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{money(summary.revenue_mxn ?? 0)}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="tool">
          <span className="toolLabel">Filtro status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
        </div>

        <div className="tool grow">
          <span className="toolLabel">Búsqueda (email, id, artista, usuario)</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej: user1, hotmail, atlas, 12..." />
        </div>
      </div>

      <div className="card pad">
        {loading ? (
          "Cargando…"
        ) : rows.length === 0 ? (
          <div className="muted">Sin registros.</div>
        ) : (
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Artista</th>
                  <th>Precio</th>
                  <th>Tipo</th>
                  <th>Prioridad</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="mono">#{r.id}</td>
                    <td>{r.owner_username || r.user_id || "—"}</td>
                    <td>{r.email}</td>
                    <td>{r.artist_name || "—"}</td>
                    <td>{money(r.price_mxn)}</td>
                    <td>{r.commission_type || "—"}</td>
                    <td>{r.priority || "—"}</td>
                    <td>{r.deadline || "—"}</td>
                    <td><StatusBadge status={r.status} /></td>

                    <td className="actionsCell">
                      <Link className="btn btnSoft" to={`/commissions/${r.id}`}>Ver</Link>
                      <button className="btn btnSoft" onClick={() => setRowStatus(r.id, "pending")}>pending</button>
                      <button className="btn btnSoft" onClick={() => setRowStatus(r.id, "accepted")}>accepted</button>
                      <button className="btn btnSoft" onClick={() => setRowStatus(r.id, "rejected")}>rejected</button>
                      <button className="btn btnDanger" onClick={() => remove(r.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mutedSmall" style={{ marginTop: 10 }}>
              Tip: usa búsqueda para encontrar por username, id o email.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
