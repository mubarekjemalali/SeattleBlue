import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPublicBooking, cancelPublicBooking } from "../api/publicBookingApi";

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

function statusLabel(status) {
  switch (status) {
    case "CREATED":
      return "Created";
    case "ASSIGNED":
      return "Assigned";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED_BY_CUSTOMER":
      return "Cancelled by customer";
    case "CANCELLED_BY_DISPATCHER":
      return "Cancelled by dispatcher";
    default:
      return status || "Unknown";
  }
}

function statusBadgeStyle(status) {
  const base = {
    padding: "6px 12px",
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
    case "ASSIGNED":
      return { ...base, background: "var(--blue-50)", color: "var(--blue-900)" };
    case "CANCELLED_BY_CUSTOMER":
    case "CANCELLED_BY_DISPATCHER":
      return { ...base, background: "#fff5f5", color: "#b91c1c", border: "1px solid #fecaca" };
    case "CREATED":
    default:
      return { ...base, background: "#fff", color: "var(--text)" };
  }
}

const textAreaStyle = {
  width: "100%",
  minHeight: 110,
  borderRadius: 12,
  border: "1px solid var(--border)",
  padding: "12px 14px",
  background: "#fff",
  color: "var(--text)",
  resize: "vertical",
  font: "inherit",
};

function canCustomerCancel(status) {
  return status === "CREATED";
}

function bookingHelpMessage(status) {
  switch (status) {
    case "CREATED":
      return "You can cancel this booking online.";
    case "ASSIGNED":
      return "This booking has already been assigned to a driver and can no longer be cancelled online. Please contact dispatch for assistance.";
    case "COMPLETED":
      return "This trip has already been completed.";
    case "CANCELLED_BY_CUSTOMER":
    case "CANCELLED_BY_DISPATCHER":
      return "This booking has already been cancelled.";
    default:
      return "Booking status is unavailable.";
  }
}

export default function ManageBookingPage() {
  const brand = useMemo(
    () => ({
      companyName: "Seattle Blue Cab",
      phoneDisplay: "(206) 555-0123",
      phoneDial: "+12065550123",
      email: "info@seattlebluecab.com",
      addressShort: "Seattle, WA",
      socials: { facebook: "#", instagram: "#", x: "#" },
    }),
    []
  );

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [booking, setBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const loadBooking = async () => {
    if (!token) {
      setError("Booking link is missing a token.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getPublicBooking(token);
      setBooking(data);
    } catch (e) {
      setError(e?.message || "Failed to load booking.");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCancel = async () => {
    if (!booking) return;

    if (!canCustomerCancel(booking.status)) {
      setError("This booking can no longer be cancelled online.");
      setInfo("");
      return;
    }

    const reason = cancelReason.trim() || "Cancelled by customer via self-service.";

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancelLoading(true);
    setError("");
    setInfo("");

    try {
      await cancelPublicBooking(token, reason);
      setInfo("Your booking has been cancelled.");
      await loadBooking();
    } catch (e) {
      setError(e?.message || "Failed to cancel booking.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div>
      <TopBar brand={brand} />
      <Navbar brand={brand} />

      <section className="section" style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff)" }}>
        <div className="container">
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="kicker">Customer</div>
            <h1 className="h1" style={{ marginBottom: 6 }}>Manage Booking</h1>
            <div className="muted" style={{ lineHeight: 1.6 }}>
              View the latest status of your booking and cancel it online if it is still eligible.
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 12 }}>
            {error && (
              <div className="card" style={{ padding: 12, border: "1px solid #fecaca", background: "#fff5f5" }}>
                <div style={{ fontWeight: 800, color: "#b91c1c" }}>Error</div>
                <div style={{ color: "#7f1d1d", marginTop: 4 }}>{error}</div>
              </div>
            )}

            {info && !error && (
              <div className="card" style={{ padding: 12, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
                <div style={{ fontWeight: 900, color: "#166534" }}>OK</div>
                <div className="muted" style={{ marginTop: 4 }}>{info}</div>
              </div>
            )}

            <div className="card" style={{ padding: 18, borderRadius: 18 }}>
              {loading ? (
                <div className="muted">Loading booking…</div>
              ) : !booking ? (
                <div className="muted">Booking could not be found.</div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 20 }}>
                        {formatTime(booking.pickupTime) || "—"}
                        <span className="muted" style={{ marginLeft: 8, fontWeight: 700, fontSize: 14 }}>
                          {formatDate(booking.pickupTime)}
                        </span>
                      </div>
                      <div className="muted" style={{ marginTop: 6 }}>
                        Booking reference: <b>{booking.publicToken || "—"}</b>
                      </div>
                    </div>

                    <div>
                      <span style={statusBadgeStyle(booking.status)}>
                        {statusLabel(booking.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid2" style={{ gap: 14, marginTop: 18 }}>
                    <div className="card" style={{ padding: 14, borderRadius: 14 }}>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>Pickup</div>
                      <div className="muted">{booking.pickupAddress || "—"}</div>
                    </div>

                    <div className="card" style={{ padding: 14, borderRadius: 14 }}>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>Drop-off</div>
                      <div className="muted">{booking.dropoffAddress || "—"}</div>
                    </div>
                  </div>

                  <div className="grid grid2" style={{ gap: 14, marginTop: 14 }}>
                    <div className="card" style={{ padding: 14, borderRadius: 14 }}>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>Driver</div>
                      <div className="muted">
                        {booking.driverName || "Not assigned yet"}
                      </div>
                    </div>

                    <div className="card" style={{ padding: 14, borderRadius: 14 }}>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>Vehicle</div>
                      <div className="muted">
                        {booking.driverVehicleType ? vehicleLabel(booking.driverVehicleType) : "—"}
                      </div>
                    </div>
                  </div>

                  <div
                    className="card"
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      marginTop: 16,
                      background: canCustomerCancel(booking.status) ? "var(--blue-50)" : "#f8fafc",
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>Cancellation</div>
                    <div className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
                      {bookingHelpMessage(booking.status)}
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>Reason for cancellation</div>
                      <textarea
                        className="input"
                        style={textAreaStyle}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Optional: tell us why you are cancelling this booking."
                        disabled={!canCustomerCancel(booking.status) || cancelLoading}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                      <button
                        type="button"
                        className="btn"
                        onClick={handleCancel}
                        disabled={!canCustomerCancel(booking.status) || cancelLoading}
                        style={
                          canCustomerCancel(booking.status)
                            ? { background: "#b91c1c", color: "#fff", border: "0" }
                            : { opacity: 0.55, cursor: "not-allowed" }
                        }
                        title={!canCustomerCancel(booking.status) ? "Online cancellation is not available for this booking status." : ""}
                      >
                        {cancelLoading ? "Cancelling…" : "Cancel Booking"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  );
}