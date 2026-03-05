import React from "react";

export default function Pagination({ page, setPage, hasPrev, hasNext }) {
  return (
    <div className="pagination">
      <button className="btn btnGhost" disabled={!hasPrev} onClick={() => setPage(page - 1)}>
        ← Anterior
      </button>
      <div className="pageIndicator">Página {page}</div>
      <button className="btn btnGhost" disabled={!hasNext} onClick={() => setPage(page + 1)}>
        Siguiente →
      </button>
    </div>
  );
}