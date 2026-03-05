import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";

export default function CommissionDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { role } = useAuth();

  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patching, setPatching] = useState(false);
  const [showImg, setShowImg] = useState(false);

  const imgUrl = useMemo(() => {
    if (!item?.reference_image) return "";
    return `/uploads/${item.reference_image}`;
  }, [item]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/commissions/${id}`);
      setItem(res.data);

      try {
        const h = await api.get(`/commissions/${id}/history`);
        setHistory(Array.isArray(h.data) ? h.data : []);
      } catch {
        setHistory([]);
      }
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo cargar la comision", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setStatus = async (status) => {
    try {
      setPatching(true);
      await api.patch(`/commissions/${id}/status`, { status });
      toast.push("Status actualizado", "success");
      load();
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo actualizar status", "error");
    } finally {
      setPatching(false);
    }
  };

  const remove = async () => {
    if (!confirm("?Eliminar comision?")) return;
    try {
      await api.delete(`/commissions/${id}`);
      toast.push("Comision eliminada", "success");
      nav("/dashboard");
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo eliminar", "error");
    }
  };

  if (loading) return <div className="page"><div className="card pad">Cargando...</div></div>;
  if (!item) return <div className="page"><div className="card pad">No disponible.</div></div>;

  const formatMoney = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return "?";
    return `$${n.toFixed(2)} MXN`;
  };

  const formatDate = (d) => {
    if (!d) return "?";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  const formatDeadline = (d) => (d ? String(d) : "?");

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Comision #{item.id}</h1>

          {role !== "admin" && (
            <p className="mutedSmall">Folio personal: #{item.user_seq ?? "N/A"}</p>
          )}

          {role === "admin" && (
            <p className="mutedSmall">ID real: #{item.id} - Folio usuario: #{item.user_seq ?? "N/A"}</p>
          )}

          <p className="muted">Detalle completo + timeline de cambios.</p>
        </div>

        <div className="rowGap">
          <Link className="btn btnGhost" to="/dashboard">Volver</Link>
          {role === "admin" && (
            <Link className="btn btnPrimary" to={`/commissions/${item.id}/edit`}>
              Editar
            </Link>
          )}
        </div>
      </div>

      <div className="grid2">
        <div className="card pad">
          <div className="cardTitleRow">
            <div className="cardTitle">Informacion</div>
            <StatusBadge status={item.status} />
          </div>

          <div className="kv">
            {role === "admin" && (
              <>
                <div className="k">Dueno</div>
                <div className="v">{item.owner_username || item.user_id || "?"}</div>
              </>
            )}

            <div className="k">Email</div>
            <div className="v">{item.email}</div>

            <div className="k">Artista</div>
            <div className="v">{item.artist_name || "?"}</div>

            <div className="k">Precio</div>
            <div className="v">{formatMoney(item.price_mxn)}</div>

            <div className="k">Tipo</div>
            <div className="v">{item.commission_type || "?"}</div>

            <div className="k">Prioridad</div>
            <div className="v">{item.priority || "?"}</div>

            <div className="k">Deadline</div>
            <div className="v">{formatDeadline(item.deadline)}</div>

            <div className="k">Creado</div>
            <div className="v">{formatDate(item.created_at)}</div>

            <div className="k">Descripcion</div>
            <div className="v">{item.description}</div>

            {role === "admin" && (
              <>
                <div className="k">Notas (admin)</div>
                <div className="v">{item.admin_notes || "?"}</div>
              </>
            )}
          </div>

          {role === "admin" && (
            <>
              <div className="divider" />
              <div className="cardTitle">Acciones admin</div>
              <div className="adminActions">
                <button className="btn btnSoft" disabled={patching} onClick={() => setStatus("pending")}>pending</button>
                <button className="btn btnSoft" disabled={patching} onClick={() => setStatus("accepted")}>accepted</button>
                <button className="btn btnSoft" disabled={patching} onClick={() => setStatus("rejected")}>rejected</button>
                <button className="btn btnDanger" onClick={remove}>Eliminar</button>
              </div>
            </>
          )}
        </div>

        <div className="card pad">
          <div className="cardTitle">Referencia</div>
          {imgUrl ? (
            <>
              <img
                className="previewImg"
                src={imgUrl}
                alt="Referencia"
                style={{ cursor: "zoom-in" }}
                onClick={() => setShowImg(true)}
              />
              <div className="mutedSmall">Click para ampliar.</div>
            </>
          ) : (
            <div className="muted">Sin imagen.</div>
          )}

          <div className="divider" />

          <div className="cardTitle">Timeline</div>
          {history.length === 0 ? (
            <div className="mutedSmall">Sin historial (o aun no esta habilitado).</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              {history.map((h) => {
                const label =
                  h.action === "created"
                    ? "Creada"
                    : `Status: ${h.old_status ?? "?"} -> ${h.new_status}`;

                return (
                  <div key={h.id} className="card" style={{ padding: 12, background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700 }}>{label}</div>
                      <div className="mutedSmall">{formatDate(h.changed_at)}</div>
                    </div>
                    <div className="mutedSmall">
                      Por: {h.changed_by_username || h.changed_by_user_id || "?"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showImg && (
        <div
          onClick={() => setShowImg(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
            zIndex: 999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={imgUrl}
            alt="Referencia ampliada"
            style={{
              maxWidth: "min(1000px, 95vw)",
              maxHeight: "85vh",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          />
        </div>
      )}
    </div>
  );
}
