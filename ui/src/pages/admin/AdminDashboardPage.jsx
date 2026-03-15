import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { listAdminBookings, completeAdminBooking, cancelAdminBooking } from "../../api/adminBookingsApi";
import { assignDriver, getEligibleDrivers } from "../../api/adminAssignApi";
import AssignDriverModal from "./components/AssignDriverModal";
import BookingActionsMenu from "./components/BookingActionsMenu";
import CancelBookingModal from "./components/CancelBookingModal";

/** ---------- helpers ---------- */
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

function shortAddress(s) {
  if (!s) return "";
  return s.length > 44 ? s.slice(0, 44) + "…" : s;
}

function toIsoLocalDateTime(dateTimeLocalStr) {
  // input type="datetime-local" gives "YYYY-MM-DDTHH:mm"
  if (!dateTimeLocalStr) return "";
  return dateTimeLocalStr.length === 16 ? `${dateTimeLocalStr}:00` : dateTimeLocalStr;
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

function canAssign(status) {
  // You can adjust this later based on your exact workflow rules
  return status === "CREATED" || status === "ASSIGNED";
}

function canComplete(status) {
  // Endpoint not yet provided, but keep rule ready
  return status === "ASSIGNED";
}

function canCancel(status) {
  return status === "CREATED" || status === "ASSIGNED";
}

async function copyText(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
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




/** ---------- main page ---------- */
export default function AdminDashboardPage() {
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

  // Tabs: UI grouping
  const [tab, setTab] = useState("ACTIVE"); // ACTIVE | COMPLETED | ALL

  // Backend supports single status. Default per tab:
  const defaultStatusForTab = (t) => {
    if (t === "COMPLETED") return "COMPLETED";
    if (t === "ACTIVE") return "CREATED";
    return ""; // ALL
  };

  // Filters
  const [status, setStatus] = useState(defaultStatusForTab("ACTIVE"));
  const [q, setQ] = useState("");
  const [fromLocal, setFromLocal] = useState("");
  const [toLocal, setToLocal] = useState("");

  // Compact filter bar (collapsed by default; auto-collapses on small screens)
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Paging
  const [page, setPage] = useState(0);
  const size = 20;
  const sort = "pickupTime,desc";

  // Data
  const [pageData, setPageData] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Actions menu
//   const [menuOpenForId, setMenuOpenForId] = useState(null);
  // Actions menu
  const [menuOpenForId, setMenuOpenForId] = useState(null);
  const [menuCoords, setMenuCoords] = useState({}); // { [bookingId]: { top, left } }
  const [menuPlacement, setMenuPlacement] = useState({}); // { [bookingId]: "up" | "down" }

  // Assign modal
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignBooking, setAssignBooking] = useState(null);

  // cancel modal
  // Cancel modal
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

//   const closeMenu = () => setMenuOpenForId(null);
const closeMenu = () => {
  setMenuOpenForId(null);
};

  // close menu on outside click

    // close menu on outside click / scroll / resize
    const docClickRef = useRef(null);

    useEffect(() => {
      const onDoc = (e) => {
        if (!docClickRef.current) return;

        if (!e.target.closest?.(".adminMenu") && !e.target.closest?.(".adminMenuPanel")) {
          closeMenu();
        }
      };

      const onScroll = () => {
        closeMenu();
      };

      const onResize = () => {
        closeMenu();
      };

      document.addEventListener("mousedown", onDoc);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onResize);

      return () => {
        document.removeEventListener("mousedown", onDoc);
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onResize);
      };
    }, []);

    const openMenuFor = (bookingId, btnEl) => {
      if (menuOpenForId === bookingId) {
        closeMenu();
        return;
      }

      let placement = "down";
      let top = 0;
      let left = 0;

      try {
        const rect = btnEl.getBoundingClientRect();
        const menuHeightEstimate = 220;
        const menuWidthEstimate = 220;
        const gap = 8;

        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < menuHeightEstimate) {
          placement = "up";
        }

        top =
          placement === "down"
            ? rect.bottom + gap
            : rect.top - menuHeightEstimate - gap;

        left = rect.right - menuWidthEstimate;

        // Keep menu inside viewport horizontally
        if (left < 8) left = 8;
        if (left + menuWidthEstimate > window.innerWidth - 8) {
          left = window.innerWidth - menuWidthEstimate - 8;
        }

        // Keep menu inside viewport vertically
        if (top < 8) top = 8;
        if (top + menuHeightEstimate > window.innerHeight - 8) {
          top = Math.max(8, window.innerHeight - menuHeightEstimate - 8);
        }
      } catch {
        top = 100;
        left = 100;
      }

      setMenuPlacement((prev) => ({ ...prev, [bookingId]: placement }));
      setMenuCoords((prev) => ({ ...prev, [bookingId]: { top, left } }));
      setMenuOpenForId(bookingId);
    };

  const load = async ({ resetPage = false } = {}) => {
    setLoading(true);
    setError("");
    // keep info unless caller sets it
    try {
      const nextPage = resetPage ? 0 : page;

      const res = await listAdminBookings({
        status: status || undefined,
        from: fromLocal ? toIsoLocalDateTime(fromLocal) : undefined,
        to: toLocal ? toIsoLocalDateTime(toLocal) : undefined,
        q: q || undefined,
        page: nextPage,
        size,
        sort,
      });

      setPageData(res);
      if (resetPage) setPage(0);
    } catch (e) {
      setError(e?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = defaultStatusForTab(tab);
    setStatus(s);
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    load({ resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Auto-collapse filters on small screens
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile) setFiltersOpen(false);
    };
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  const clearFilters = () => {
    setQ("");
    setFromLocal("");
    setToLocal("");
    setInfo("Filters cleared.");
    setPage(0);
    setTimeout(() => load({ resetPage: true }), 0);
  };

  const onApplyFilters = (e) => {
    e.preventDefault();
    load({ resetPage: true });
  };

  const bookings = pageData?.content || [];
  const totalElements = pageData?.totalElements ?? 0;
  const totalPages = pageData?.totalPages ?? 0;
  const currentPage = pageData?.number ?? page;

  const canPrev = currentPage > 0;
  const canNext = totalPages ? currentPage < totalPages - 1 : bookings.length === size;

  const openAssign = (b) => {
    closeMenu();
    setAssignBooking(b);
    setAssignOpen(true);
  };

  const onAssigned = () => {
    // reload current page after assign
    load({ resetPage: false });
  };

const handleCompleteBooking = async (booking) => {
  closeMenu();

  const bookingLabel = booking?.customerName
    ? `${booking.customerName}'s booking`
    : `booking #${booking.id}`;

  const confirmed = window.confirm(
    `Mark ${bookingLabel} as completed?`
  );

  if (!confirmed) return;

  setLoading(true);
  setError("");

  try {
    await completeAdminBooking(booking.id);
    setInfo(`${bookingLabel} was marked as completed.`);
    await load({ resetPage: false });
  } catch (e) {
    setError(e?.message || "Failed to complete booking.");
    setInfo("");
  } finally {
    setLoading(false);
  }
};

const openCancel = (booking) => {
  closeMenu();
  setCancelBooking(booking);
  setCancelOpen(true);
};

const handleCancelBooking = async (reason) => {
  if (!cancelBooking?.id) return;

  setCancelLoading(true);
  setError("");

  try {
    await cancelAdminBooking(cancelBooking.id, reason);

    const bookingLabel = cancelBooking?.customerName
      ? `${cancelBooking.customerName}'s booking`
      : `booking #${cancelBooking.id}`;

    setInfo(`${bookingLabel} was cancelled.`);
    setCancelOpen(false);
    setCancelBooking(null);
    await load({ resetPage: false });
  } catch (e) {
    setError(e?.message || "Failed to cancel booking.");
    setInfo("");
  } finally {
    setCancelLoading(false);
  }
};

  return (
    <div ref={docClickRef}>
      <TopBar brand={brand} />
      <Navbar brand={brand} />

      {/* Header + tabs */}
      <section className="section" style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="kicker">Admin</div>
              <h1 className="h1" style={{ marginBottom: 6 }}>Dashboard</h1>
              <div className="muted" style={{ lineHeight: 1.6 }}>
                View dispatcher bookings. Assign drivers and manage active trips.
              </div>
            </div>

            <button className="btn btnGhost" onClick={() => load()} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Tabs */}
          <div
            className="card"
            style={{
              marginTop: 16,
              padding: 10,
              display: "flex",
              gap: 10,
              borderRadius: 16,
              flexWrap: "wrap",
            }}
          >
            {[
              { key: "ACTIVE", label: "Active" },
              { key: "COMPLETED", label: "Completed" },
              { key: "ALL", label: "All" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                className="btn"
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  minWidth: 160,
                  background: tab === t.key ? "var(--blue-900)" : "transparent",
                  color: tab === t.key ? "#fff" : "var(--text)",
                  border: tab === t.key ? "0" : "1px solid var(--border)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + messages + bookings */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: "grid", gap: 12 }}>
          {/* Messages (only shows when present) */}
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

          {/* Filters */}
          <form
            onSubmit={onApplyFilters}
            className="card"
            style={{
              padding: 10,
              borderRadius: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="btn"
              onClick={() => setFiltersOpen((v) => !v)}
              style={{
                minWidth: 140,
                background: filtersOpen ? "var(--blue-900)" : "transparent",
                color: filtersOpen ? "#fff" : "var(--text)",
                border: filtersOpen ? "0" : "1px solid var(--border)",
                fontWeight: 900,
              }}
            >
              Filters {filtersOpen ? "▲" : "▼"}
            </button>

{/*             <div style={{ minWidth: 220, flex: 1 }}> */}
{/*               <select */}
{/*                 className="input" */}
{/*                 style={compactInputStyle} */}
{/*                 value={status} */}
{/*                 onChange={(e) => setStatus(e.target.value)} */}
{/*               > */}
{/*                 <option value="">(All statuses)</option> */}
{/*                 <option value="CREATED">CREATED</option> */}
{/*                 <option value="ASSIGNED">ASSIGNED</option> */}
{/*                 <option value="COMPLETED">COMPLETED</option> */}
{/*                 <option value="CANCELLED">CANCELLED</option> */}
{/*               </select> */}
{/*             </div> */}
            {(!isMobile || filtersOpen) && (
              <div style={{ minWidth: 220, flex: 1 }}>
                <select
                  className="input"
                  style={compactInputStyle}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">(All statuses)</option>
                  <option value="CREATED">CREATED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            )}

{/*             <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}> */}
{/*               <button type="button" className="btn btnGhost" onClick={clearFilters}> */}
{/*                 Clear */}
{/*               </button> */}
{/*               <button type="submit" className="btn btnPrimary" disabled={loading}> */}
{/*                 {loading ? "Applying..." : "Apply"} */}
{/*               </button> */}
{/*             </div> */}

{/*              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}> */}
{/*                {isMobile ? ( */}
{/*                  <> */}
{/*                    <button */}
{/*                      type="button" */}
{/*                      className="btn btnGhost" */}
{/*                      onClick={clearFilters} */}
{/*                      title="Clear filters" */}
{/*                      style={{ paddingInline: 12 }} */}
{/*                    > */}
{/*                      ✕ */}
{/*                    </button> */}
{/*                    <button */}
{/*                      type="button" */}
{/*                      className="btn btnPrimary" */}
{/*                      onClick={() => load({ resetPage: true })} */}
{/*                      disabled={loading} */}
{/*                      title="Apply filters" */}
{/*                      style={{ paddingInline: 12 }} */}
{/*                    > */}
{/*                      ✓ */}
{/*                    </button> */}
{/*                  </> */}
{/*                ) : ( */}
{/*                  <> */}
{/*                    <button type="button" className="btn btnGhost" onClick={clearFilters}> */}
{/*                      Clear */}
{/*                    </button> */}
{/*                    <button type="submit" className="btn btnPrimary" disabled={loading}> */}
{/*                      {loading ? "Applying..." : "Apply"} */}
{/*                    </button> */}
{/*                  </> */}
{/*                )} */}
{/*              </div> */}

             {(!isMobile || filtersOpen) && (
               <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                 {/* keep your existing mobile icon ✓ / ✕ logic if you want, or keep words */}
                 {isMobile ? (
                   <>
                     <button
                       type="button"
                       className="btn btnGhost"
                       onClick={clearFilters}
                       title="Clear filters"
                       style={{ paddingInline: 12 }}
                     >
                       ✕
                     </button>
                     <button
                       type="button"
                       className="btn btnPrimary"
                       onClick={() => load({ resetPage: true })}
                       disabled={loading}
                       title="Apply filters"
                       style={{ paddingInline: 12 }}
                     >
                       ✓
                     </button>
                   </>
                 ) : (
                   <>
                     <button type="button" className="btn btnGhost" onClick={clearFilters}>
                       Clear
                     </button>
                     <button type="submit" className="btn btnPrimary" disabled={loading}>
                       {loading ? "Applying..." : "Apply"}
                     </button>
                   </>
                 )}
               </div>
             )}
            {filtersOpen && (
              <div className="grid grid2" style={{ width: "100%", gap: 12, marginTop: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 6 }}>
                    Search (customer / phone / email)
                  </div>
                  <input
                    className="input"
                    style={compactInputStyle}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Type to search…"
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 6 }}>From</div>
                  <input
                    className="input"
                    style={compactInputStyle}
                    type="datetime-local"
                    value={fromLocal}
                    onChange={(e) => setFromLocal(e.target.value)}
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 6 }}>To</div>
                  <input
                    className="input"
                    style={compactInputStyle}
                    type="datetime-local"
                    value={toLocal}
                    onChange={(e) => setToLocal(e.target.value)}
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Driver</div>
                  <input
                    className="input"
                    style={compactInputStyle}
                    value=""
                    disabled
                    placeholder="Driver filter (coming soon)"
                  />
                </div>
              </div>
            )}
          </form>

          {/* Bookings header + paging */}
          <div className="card" style={{ padding: 16, overflow: "visible" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 900 }}>Bookings</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {loading ? "Loading…" : `${bookings.length} on this page • ${totalElements} total`}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  className="btn btnGhost"
                  disabled={!canPrev || loading}
                  onClick={() => {
                    const next = Math.max(0, currentPage - 1);
                    setPage(next);
                    setTimeout(() => {
                      setLoading(true);
                      listAdminBookings({
                        status: status || undefined,
                        from: fromLocal ? toIsoLocalDateTime(fromLocal) : undefined,
                        to: toLocal ? toIsoLocalDateTime(toLocal) : undefined,
                        q: q || undefined,
                        page: next,
                        size,
                        sort,
                      })
                        .then(setPageData)
                        .catch((e) => setError(e?.message || "Failed to load bookings."))
                        .finally(() => setLoading(false));
                    }, 0);
                  }}
                >
                  ← Prev
                </button>

                <div className="muted" style={{ fontSize: 13 }}>
                  Page {totalPages ? currentPage + 1 : currentPage + 1}
                  {totalPages ? ` / ${totalPages}` : ""}
                </div>

                <button
                  type="button"
                  className="btn btnGhost"
                  disabled={!canNext || loading}
                  onClick={() => {
                    const next = currentPage + 1;
                    setPage(next);
                    setTimeout(() => {
                      setLoading(true);
                      listAdminBookings({
                        status: status || undefined,
                        from: fromLocal ? toIsoLocalDateTime(fromLocal) : undefined,
                        to: toLocal ? toIsoLocalDateTime(toLocal) : undefined,
                        q: q || undefined,
                        page: next,
                        size,
                        sort,
                      })
                        .then(setPageData)
                        .catch((e) => setError(e?.message || "Failed to load bookings."))
                        .finally(() => setLoading(false));
                    }, 0);
                  }}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Desktop table */}
            <div className="adminDesktopOnly" style={{ marginTop: 12, overflowX: "auto", overflowY: "visible" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "10px 8px" }}>Pickup time</th>
                    <th style={{ padding: "10px 8px" }}>Customer</th>
                    <th style={{ padding: "10px 8px" }}>Route</th>
                    <th style={{ padding: "10px 8px" }}>Driver</th>
                    <th style={{ padding: "10px 8px" }}>Status</th>
                    <th style={{ padding: "10px 8px" }}>Vehicle</th>
                    <th style={{ padding: "10px 8px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => {
                    const showFlat = b.fixedRoutePrice != null;
                    const assigned = !!b.driverId;
                    const driverLine = assigned ? (b.driverName || `Driver #${b.driverId}`) : "Unassigned";

                    return (
                      <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px 8px" }}>
                          <div style={{ fontWeight: 900 }}>{formatTime(b.pickupTime) || "—"}</div>
                          <div className="muted" style={{ marginTop: 2, fontSize: 12 }}>{formatDate(b.pickupTime)}</div>
                        </td>

                        <td style={{ padding: "10px 8px" }}>
                          <div style={{ fontWeight: 900 }}>{b.customerName || "—"}</div>
                          <div className="muted" style={{ fontSize: 12 }}>{b.customerPhone || ""}</div>
                          <div className="muted" style={{ fontSize: 12 }}>{b.customerEmail || ""}</div>
                        </td>

                        <td style={{ padding: "10px 8px" }}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            {showFlat && <span style={pillStyle()}>Flat-rate</span>}
                          </div>

                          <div style={{ marginTop: 6 }}>
                            <div style={{ fontWeight: 900, fontSize: 12 }}>From</div>
                            <div className="muted" title={b.pickupAddress || ""} style={{ fontSize: 12, marginTop: 2 }}>
                              {shortAddress(b.pickupAddress) || "—"}
                            </div>
                          </div>

                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontWeight: 900, fontSize: 12 }}>To</div>
                            <div className="muted" title={b.dropoffAddress || ""} style={{ fontSize: 12, marginTop: 2 }}>
                              {shortAddress(b.dropoffAddress) || "—"}
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: "10px 8px" }}>
                          <div style={{ fontWeight: 900 }}>{driverLine}</div>
                          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                            {b.driverVehicleType ? `${vehicleLabel(b.driverVehicleType)}` : ""}
                            {b.driverEnabled === false ? " • (disabled)" : ""}
                          </div>
                        </td>

                        <td style={{ padding: "10px 8px" }}>
                          <span style={statusBadgeStyle(b.status)}>{b.status || "UNKNOWN"}</span>
                        </td>

                        <td style={{ padding: "10px 8px" }}>
                          <div style={{ fontWeight: 900 }}>{vehicleLabel(b.selectedVehicleType)}</div>
                        </td>
{/*  Desktop VERSION*/}
                        <td style={{ padding: "10px 8px" }}>
                            <BookingActionsMenu
                              booking={b}
                              menuOpen={menuOpenForId === b.id}
                              coords={menuCoords[b.id]}
                              canAssign={canAssign(b.status)}
                              canComplete={canComplete(b.status)}
                              canCancel={canCancel(b.status)}
                              onToggleMenu={(e) => openMenuFor(b.id, e.currentTarget)}
                              onAssign={() => openAssign(b)}
                              onCopyToken={async () => {
                                const ok = await copyText(b.publicToken || "");
                                setInfo(ok ? "Public token copied." : "Could not copy token.");
                                closeMenu();
                              }}
                              onCompleteBooking={() => handleCompleteBooking(b)}
                              onCancelBooking={() => openCancel(b)}
                            />


                        </td>
                      </tr>
                    );
                  })}

                  {!loading && bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 14 }} className="muted">
                        No bookings found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="adminMobileOnly" style={{ marginTop: 12 }}>
              <div className="adminMobileList">
                {bookings.map((b) => {
                  const showFlat = b.fixedRoutePrice != null;
                  const assigned = !!b.driverId;
                  const driverLine = assigned ? (b.driverName || `Driver #${b.driverId}`) : "Unassigned";

                  return (
                    <div key={b.id} className="card" style={{ padding: 14, borderRadius: 16 }}>
                      {/* Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: 16 }}>{formatTime(b.pickupTime) || "—"}</div>
                          <div className="muted" style={{ marginTop: 2, fontSize: 12 }}>{formatDate(b.pickupTime)}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={statusBadgeStyle(b.status)}>{b.status || "UNKNOWN"}</span>
                          {showFlat && <span style={pillStyle()}>Flat-rate</span>}
                        </div>
                      </div>

                      {/* Route */}
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontWeight: 900, fontSize: 12 }}>From</div>
                        <div className="muted" style={{ marginTop: 3 }}>{b.pickupAddress || "—"}</div>
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontWeight: 900, fontSize: 12 }}>To</div>
                        <div className="muted" style={{ marginTop: 3 }}>{b.dropoffAddress || "—"}</div>
                      </div>

                      {/* Customer */}
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontWeight: 900 }}>Customer</div>
                        <div className="muted" style={{ marginTop: 3 }}>
                          <div><b style={{ color: "var(--text)" }}>{b.customerName || "—"}</b></div>
                          {b.customerPhone && <div>{b.customerPhone}</div>}
                          {b.customerEmail && <div style={{ fontSize: 12 }}>{b.customerEmail}</div>}
                        </div>
                      </div>

                      {/* Driver + vehicle */}
                      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 900 }}>Driver</div>
                          <div className="muted" style={{ marginTop: 3 }}>
                            <div><b style={{ color: "var(--text)" }}>{driverLine}</b></div>
                            {(b.driverVehicleType || b.driverEnabled === false) && (
                              <div style={{ fontSize: 12 }}>
                                {b.driverVehicleType ? vehicleLabel(b.driverVehicleType) : ""}
                                {b.driverEnabled === false ? " • (disabled)" : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontWeight: 900 }}>Requested vehicle</div>
                          <div className="muted" style={{ marginTop: 3 }}>{vehicleLabel(b.selectedVehicleType)}</div>
                        </div>
                      </div>

                      {/* Actions (mobile: Assign visible + More) */}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                      {canAssign(b.status) && (
                            <button className="btn btnPrimary" type="button" onClick={() => openAssign(b)} disabled={loading}>
                              {b.driverId ? "Reassign" : "Assign"}
                            </button>

                        )}
{/*  MOBILE version*/}
                        <BookingActionsMenu
                          booking={b}
                          menuOpen={menuOpenForId === b.id}
                          coords={menuCoords[b.id]}
                          canAssign={canAssign(b.status)}
                          canComplete={canComplete(b.status)}
                          canCancel={canCancel(b.status)}
                          onToggleMenu={(e) => openMenuFor(b.id, e.currentTarget)}
                          onAssign={() => openAssign(b)}
                          onCopyToken={async () => {
                            const ok = await copyText(b.publicToken || "");
                            setInfo(ok ? "Public token copied." : "Could not copy token.");
                            closeMenu();
                          }}
                          onCompleteBooking={() => handleCompleteBooking(b)}
                          onCancelBooking={() => openCancel(b)}
                        />

                      </div>
                    </div>
                  );
                })}

                {!loading && bookings.length === 0 && (
                  <div className="card" style={{ padding: 14 }}>
                    <div className="muted">No bookings found for the selected filters.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assign modal */}
      <AssignDriverModal
        booking={assignBooking}
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssigned={onAssigned}
        setGlobalInfo={(m) => {
          setInfo(m);
          setError("");
        }}
        setGlobalError={(m) => {
          setError(m);
          setInfo("");
        }}
      />

        {/*        cancel booking modal*/}
      <CancelBookingModal
        booking={cancelBooking}
        open={cancelOpen}
        loading={cancelLoading}
        onClose={() => {
          if (cancelLoading) return;
          setCancelOpen(false);
          setCancelBooking(null);
        }}
        onConfirm={handleCancelBooking}
        setGlobalError={(m) => {
          setError(m);
          setInfo("");
        }}
      />

      <Footer brand={brand} />
    </div>
  );
}