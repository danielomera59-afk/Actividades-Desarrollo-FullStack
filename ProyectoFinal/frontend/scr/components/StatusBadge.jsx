import React from "react";

export default function StatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();
  const cls =
    s === "accepted" ? "badge badgeOk" : s === "rejected" ? "badge badgeBad" : "badge badgeWarn";

  const label = s === "accepted" ? "Accepted" : s === "rejected" ? "Rejected" : "Pending";

  return <span className={cls}>{label}</span>;
}