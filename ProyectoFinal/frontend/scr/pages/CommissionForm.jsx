import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../components/Toast";

function getNextSaturdayISO() {
  const d = new Date();
  const day = d.getDay(); // 0=Dom ... 6=Sáb
  const add = (6 - day + 7) % 7; // si hoy es sábado -> 0
  const sat = new Date(d);
  sat.setDate(d.getDate() + add);
  sat.setHours(0, 0, 0, 0);
  return sat.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function CommissionForm() {
  const nav = useNavigate();
  const toast = useToast();

  const artists = useMemo(
    () => [
      { key: "luna", name: "Luna Sketch", focus: "Boceto / lineart limpio", base: 250 },
      { key: "nova", name: "Nova Color", focus: "Color vibrante estilo anime", base: 450 },
      { key: "atlas", name: "Atlas Realism", focus: "Semi-realismo con sombras", base: 700 },
    ],
    []
  );

  const TYPE_MULT = useMemo(() => ({ bust: 1.0, half: 1.4, full: 1.9 }), []);
  const PRIORITY_MULT = useMemo(() => ({ normal: 1.0, urgent: 1.25 }), []);

  const minDeadline = useMemo(() => getNextSaturdayISO(), []);

  const [artistKey, setArtistKey] = useState("luna");
  const [commissionType, setCommissionType] = useState("bust");
  const [priority, setPriority] = useState("normal");
  const [deadline, setDeadline] = useState(minDeadline);

  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const selected = artists.find((a) => a.key === artistKey);

  const estimate = useMemo(() => {
    const base = selected?.base || 0;
    const t = TYPE_MULT[commissionType] ?? 1.0;
    const p = PRIORITY_MULT[priority] ?? 1.0;
    return Math.round(base * t * p * 100) / 100;
  }, [selected, TYPE_MULT, PRIORITY_MULT, commissionType, priority]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("artistKey", artistKey);
      fd.append("commissionType", commissionType);
      fd.append("priority", priority);
      fd.append("deadline", deadline); // siempre >= minDeadline
      fd.append("email", email);
      fd.append("description", description);
      if (file) fd.append("referenceImage", file);

      const res = await api.post("/commissions", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.push(`Comisión creada ✅ (estimado $${estimate} MXN)`, "success");
      nav(`/commissions/${res.data.id}`);
    } catch (err) {
      toast.push(err?.response?.data?.message || "No se pudo crear la comisión", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Nueva comisión</h1>
          <p className="muted">
            Elige artista, tipo, prioridad y una fecha. La fecha mínima es este sábado.
          </p>
        </div>
      </div>

      <div className="card pad">
        <div className="grid">
          {artists.map((a) => {
            const active = artistKey === a.key;
            return (
              <button
                key={a.key}
                type="button"
                className={`card pad btn ${active ? "btnPrimary" : "btnSoft"}`}
                onClick={() => setArtistKey(a.key)}
                style={{ textAlign: "left" }}
              >
                <div style={{ fontWeight: 750, marginBottom: 6 }}>{a.name} (desde ${a.base} MXN)</div>
                <div className="mutedSmall">{a.focus}</div>
              </button>
            );
          })}
        </div>

        <div className="divider" />

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span>Artista</span>
            <select value={artistKey} onChange={(e) => setArtistKey(e.target.value)}>
              {artists.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.name} (desde ${a.base} MXN)
                </option>
              ))}
            </select>
            <span className="mutedSmall">{selected?.focus}</span>
          </label>

          <div className="toolbar">
            <label className="field tool">
              <span>Tipo</span>
              <select value={commissionType} onChange={(e) => setCommissionType(e.target.value)}>
                <option value="bust">bust (x1.0)</option>
                <option value="half">half body (x1.4)</option>
                <option value="full">full body (x1.9)</option>
              </select>
            </label>

            <label className="field tool">
              <span>Prioridad</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="normal">normal (x1.0)</option>
                <option value="urgent">urgent (x1.25)</option>
              </select>
            </label>

            <label className="field tool grow">
              <span>Deadline (mínimo este sábado)</span>
              <input
                type="date"
                value={deadline}
                min={minDeadline}
                onChange={(e) => {
                  const v = e.target.value;
                  setDeadline(v && v < minDeadline ? minDeadline : v);
                }}
                required
              />
              <span className="mutedSmall">Mínimo permitido: {minDeadline}</span>
            </label>
          </div>

          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@mail.com" />
          </label>

          <label className="field">
            <span>Descripción</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe lo que quieres…"
              rows={6}
            />
          </label>

          <label className="field">
            <span>Imagen de referencia (opcional)</span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <span className="mutedSmall">PNG/JPG/WEBP recomendado, máximo ~3MB.</span>
          </label>

          <button className="btn btnPrimary" disabled={loading}>
            {loading ? "Guardando..." : `Crear (estimado $${estimate} MXN)`}
          </button>

          <div className="mutedSmall">
            *El estimado depende del tipo/prioridad. El backend calcula y guarda el precio final.
          </div>
        </form>
      </div>
    </div>
  );
}