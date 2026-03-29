import { useEffect, useState } from "react";

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

const textAreaStyle = {
  width: "100%",
  minHeight: 120,
  borderRadius: 12,
  border: "1px solid var(--border)",
  padding: "12px 14px",
  background: "#fff",
  color: "var(--text)",
  resize: "vertical",
  font: "inherit",
};

export default function CancelBookingModal({
  booking,
  open,
  onClose,
  onConfirm,
  loading,
  setGlobalError,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("");
  }, [open, booking?.id]);

  const submit = () => {
    const trimmed = reason.trim();

    if (!trimmed) {
      setGlobalError?.("Cancellation note is required.");
      return;
    }

    onConfirm?.(trimmed);
  };

  if (!open || !booking) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        zIndex: 90,
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
            <div style={{ fontWeight: 900, fontSize: 18, color: "#b91c1c" }}>Cancel booking</div>
            <div className="muted" style={{ marginTop: 4 }}>
              Please provide a cancellation note. This is required before the booking can be cancelled.
            </div>
          </div>

          <button className="btn btnGhost" type="button" onClick={onClose} disabled={loading}>
            Close
          </button>
        </div>

        <div
          className="card"
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 14,
            background: "#fff5f5",
            border: "1px solid #fecaca",
          }}
        >
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

            <div>
              <span style={statusBadgeStyle(booking.status)}>{booking.status || "UNKNOWN"}</span>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 900 }}>Customer</div>
            <div className="muted" style={{ marginTop: 2 }}>{booking.customerName || "—"}</div>
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

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>
            Cancellation note <span style={{ color: "#b91c1c" }}>*</span>
          </div>
          <textarea
            className="input"
            style={textAreaStyle}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Example: Customer requested cancellation by phone."
            disabled={loading}
          />
          <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
            This note will help explain why the dispatcher cancelled the booking.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn btnGhost" type="button" onClick={onClose} disabled={loading}>
            Back
          </button>

          <button
            className="btn"
            type="button"
            onClick={submit}
            disabled={loading}
            style={{
              background: "#b91c1c",
              color: "#fff",
              border: "0",
            }}
          >
            {loading ? "Cancelling…" : "Cancel booking"}
          </button>
        </div>
      </div>
    </div>
  );
}