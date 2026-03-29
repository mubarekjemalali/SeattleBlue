import { useEffect, useMemo, useState } from "react";
import { assignDriver, getEligibleDrivers } from "../../../api/adminAssignApi";

function formatTime(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
  } catch {}
  return "";
}

function formatDate(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
    }
  } catch {}
  return "";
}

function statusBadgeStyle(status) {
  const base = {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    display: "inline-block",
    border: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  switch (status) {
    case "COMPLETED":
      return { ...base, background: "#ecfdf5", color: "#166534", border: "1px solid #bbf7d0" };
    case "CANCELLED":
      return { ...base, background: "#fff5f5", color: "#b91c1c", border: "1px solid #fecaca" };
    case "ASSIGNED":
      return { ...base, background: "var(--blue-50)", color: "var(--blue-900)" };
    case "CREATED":
      return { ...base, background: "#fff", color: "var(--text)" };
    default:
      return { ...base, background: "#fff", color: "var(--text)" };
  }
}

function pillStyle() {
  return {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    display: "inline-block",
    border: "1px solid var(--border)",
    background: "#fff",
    color: "var(--text)",
    whiteSpace: "nowrap",
  };
}

function vehicleLabel(v) {
  switch (v) {
    case "SEDAN_4":
      return "Sedan";
    case "SUV_6":
      return "SUV";
    case "VAN_10":
      return "Van";
    default:
      return v || "—";
  }
}

const compactInputStyle = {
  height: 44,
  borderRadius: 12,
  border: "1px solid var(--border)",
  padding: "10px 12px",
  background: "#fff",
  color: "var(--text)",
};

export default function AssignDriverModal({
  booking,
  open,
  onClose,
  onAssigned,
  setGlobalInfo,
  setGlobalError,
}) {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const isReassign = !!booking?.driverId;
  const currentDriverLabel = booking?.driverName || (booking?.driverId ? `Driver #${booking.driverId}` : "");

  useEffect(() => {
    if (!open || !booking?.id) return;

    setLoading(true);
    setDrivers([]);
    setSelected(null);
    setQuery("");

    getEligibleDrivers(booking.id)
      .then((list) => setDrivers(Array.isArray(list) ? list : []))
      .catch((e) => setGlobalError?.(e?.message || "Failed to load eligible drivers."))
      .finally(() => setLoading(false));
  }, [open, booking?.id, setGlobalError]);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const name = `${d.firstName || ""} ${d.lastName || ""}`.trim().toLowerCase();
      const phone = (d.phoneNumber || "").toLowerCase();
      const q = (query || "").trim().toLowerCase();
      if (!q) return true;
      return name.includes(q) || phone.includes(q);
    });
  }, [drivers, query]);

  const submit = async () => {
    if (!booking?.id) return;

    if (!selected?.driverId) {
      setGlobalError?.("Please select a driver before assigning.");
      return;
    }

    // FIX APPLIED HERE:
    // If this booking already has a driver and user picked a different one,
    // show a confirmation before reassignment.
    if (isReassign && booking.driverId !== selected.driverId) {
      const confirmed = window.confirm(
        `This booking is already assigned to ${currentDriverLabel}.\n\nAre you sure you want to assign it to a new driver?`
      );

      if (!confirmed) {
        return;
      }
    }

    setLoading(true);
    try {
      await assignDriver(booking.id, selected.driverId);

      const selectedDriverName =
        `${selected.firstName || ""} ${selected.lastName || ""}`.trim() || `Driver #${selected.driverId}`;

      const customerName = booking.customerName || `booking #${booking.id}`;

      // FIX APPLIED HERE:
      // improved success message
      setGlobalInfo?.(
        isReassign
          ? `${selectedDriverName} was reassigned to ${customerName}.`
          : `${selectedDriverName} was assigned to ${customerName}.`
      );

      onAssigned?.();
      onClose?.();
    } catch (e) {
      setGlobalError?.(e?.message || "Assign driver failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 760,
          padding: 16,
          borderRadius: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>
              {isReassign ? "Reassign driver" : "Assign driver"}
            </div>

            <div className="muted" style={{ marginTop: 4 }}>
              Select drivers from the dropdown list or use the search bar to search by name or phone number.
            </div>

            {isReassign && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#fff7ed",
                  border: "1px solid #fdba74",
                  color: "#9a3412",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                This booking is currently assigned to <b>{currentDriverLabel}</b>. Selecting a new driver will reassign it.
              </div>
            )}
          </div>

          <button className="btn btnGhost" type="button" onClick={onClose} disabled={loading}>
            Close
          </button>
        </div>

        <div className="card" style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "var(--blue-50)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900 }}>
                {formatTime(booking.pickupTime)}{" "}
                <span className="muted" style={{ fontWeight: 800, marginLeft: 6 }}>
                  {formatDate(booking.pickupTime)}
                </span>
              </div>
              <div className="muted" style={{ marginTop: 4, fontSize: 13 }}>
                Vehicle requested: <b>{vehicleLabel(booking.selectedVehicleType)}</b>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={statusBadgeStyle(booking.status)}>{booking.status}</span>
              {booking.fixedRoutePrice != null && <span style={pillStyle()}>Flat-rate</span>}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 900 }}>From</div>
            <div className="muted" style={{ marginTop: 2 }}>{booking.pickupAddress || "—"}</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 900 }}>To</div>
            <div className="muted" style={{ marginTop: 2 }}>{booking.dropoffAddress || "—"}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Search drivers</div>
          <input
            className="input"
            style={compactInputStyle}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type driver name or phone…"
            disabled={loading}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Matching drivers</div>

          <div
            style={{
              maxHeight: 220,
              overflow: "auto",
              border: "1px solid var(--border)",
              borderRadius: 14,
              background: "#fff",
            }}
          >
            {loading && (
              <div className="muted" style={{ padding: 12 }}>
                Loading eligible drivers…
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="muted" style={{ padding: 12 }}>
                No matching drivers found.
              </div>
            )}

            {!loading &&
              filtered.map((d) => {
                const name =
                  `${d.firstName || ""} ${d.lastName || ""}`.trim() || `Driver #${d.driverId}`;
                const isSelected = selected?.driverId === d.driverId;

                return (
                  <button
                    key={d.driverId}
                    type="button"
                    onClick={() => setSelected(d)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: 0,
                      borderBottom: "1px solid var(--border)",
                      background: isSelected ? "var(--blue-50)" : "#fff",
                      padding: 12,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 900 }}>{name}</div>
                        <div className="muted" style={{ marginTop: 3, fontSize: 13 }}>
                          {vehicleLabel(d.vehicleType)}
                          {d.phoneNumber ? ` • ${d.phoneNumber}` : ""}
                        </div>
                      </div>

                      {isSelected && <span style={pillStyle()}>Selected</span>}
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
            Search updates automatically as you type. Click a driver to select.
          </div>
        </div>


        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button className="btn btnGhost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            className="btn btnPrimary"
            type="button"
            onClick={submit}
            disabled={loading || !selected}
          >
            {loading ? (isReassign ? "Reassigning…" : "Assigning…") : (isReassign ? "Reassign driver" : "Assign driver")}
          </button>
        </div>
      </div>
    </div>
  );
}