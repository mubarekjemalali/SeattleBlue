import { useEffect, useMemo, useState } from "react";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DriverFormModal from "./components/DriverFormModal";
import AdminSectionNav from "./components/AdminSectionNav";
import {
  listAdminDrivers,
  getAdminDriver,
  createAdminDriver,
  updateAdminDriver,
  updateAdminDriverEnabled,
} from "../../api/adminDriversApi";

function vehicleLabel(v) {
  switch (v) {
    case "SEDAN_4":
      return "Sedan";
    case "SUV_6":
      return "SUV 6";
    case "VAN_6":
      return "Van 6";
    case "VAN_10":
      return "Van 10";
    case "LUXURY":
      return "Luxury";
    case "ACCESSIBLE":
      return "Accessible";
    default:
      return v || "—";
  }
}

function statusBadgeStyle(enabled) {
  const base = {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    display: "inline-block",
    border: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  if (!enabled) {
    return { ...base, background: "#fff5f5", color: "#b91c1c", border: "1px solid #fecaca" };
  }

  return { ...base, background: "var(--blue-50)", color: "var(--blue-900)" };
}

const compactInputStyle = {
  height: 44,
  borderRadius: 12,
  border: "1px solid var(--border)",
  padding: "10px 12px",
  background: "#fff",
  color: "var(--text)",
};

export default function AdminDriversPage() {
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

  const [enabled, setEnabled] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [q, setQ] = useState("");

  const [page, setPage] = useState(0);
  const size = 20;
  const sort = "firstName,asc";

  const [pageData, setPageData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingDriver, setEditingDriver] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const load = async ({ resetPage = false } = {}) => {
    setLoading(true);
    setError("");

    try {
      const nextPage = resetPage ? 0 : page;

      const res = await listAdminDrivers({
        enabled: enabled === "" ? undefined : enabled === "true",
        vehicleType: vehicleType || undefined,
        q: q || undefined,
        page: nextPage,
        size,
        sort,
      });

      setPageData(res);
      if (resetPage) setPage(0);
    } catch (e) {
      setError(e?.message || "Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drivers = pageData?.content || [];
  const totalElements = pageData?.totalElements ?? 0;
  const totalPages = pageData?.totalPages ?? 0;
  const currentPage = pageData?.number ?? page;

  const canPrev = currentPage > 0;
  const canNext = totalPages ? currentPage < totalPages - 1 : drivers.length === size;

  const clearFilters = () => {
    setEnabled("");
    setVehicleType("");
    setQ("");
    setInfo("Filters cleared.");
    setTimeout(() => load({ resetPage: true }), 0);
  };

  const onApplyFilters = (e) => {
    e.preventDefault();
    load({ resetPage: true });
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingDriver(null);
    setModalOpen(true);
  };

  const openEdit = async (driverId) => {
    setError("");
    setInfo("");

    try {
      setLoading(true);
      const driver = await getAdminDriver(driverId);
      setModalMode("edit");
      setEditingDriver(driver);
      setModalOpen(true);
    } catch (e) {
      setError(e?.message || "Failed to load driver.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitModal = async (payload) => {
    setModalLoading(true);
    setError("");

    try {
      if (modalMode === "edit" && editingDriver?.driverId) {
        await updateAdminDriver(editingDriver.driverId, payload);
        setInfo("Driver updated successfully.");
      } else {
        await createAdminDriver(payload);
        setInfo("Driver created successfully.");
      }

      setModalOpen(false);
      setEditingDriver(null);
      await load({ resetPage: false });
    } catch (e) {
      setError(e?.message || "Failed to save driver.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleEnabled = async (driver) => {
    const nextEnabled = !driver.enabled;

    const confirmed = window.confirm(
      nextEnabled
        ? `Enable ${driver.firstName} ${driver.lastName}?`
        : `Disable ${driver.firstName} ${driver.lastName}?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      await updateAdminDriverEnabled(driver.driverId, nextEnabled);
      setInfo(
        nextEnabled
          ? `${driver.firstName} ${driver.lastName} was enabled.`
          : `${driver.firstName} ${driver.lastName} was disabled.`
      );
      await load({ resetPage: false });
    } catch (e) {
      setError(e?.message || "Failed to update driver status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar brand={brand} adminMode />
      <Navbar brand={brand} adminMode />

      <section className="section" style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff)", paddingTop: 16,
                                                                                                                      paddingBottom: 12, }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="kicker">Admin</div>
{/*               <h1 className="h1" style={{ marginBottom: 6 }}>Drivers</h1> */}
               <h1 style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 900 }}>
                            Drivers
                          </h1>
              <div className="muted" style={{ lineHeight: 1.6 }}>
                Add drivers, update their details, and enable or disable them.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
{/*               <button className="btn btnGhost" onClick={() => load()} disabled={loading}> */}
{/*                 {loading ? "Refreshing..." : "Refresh"} */}
{/*               </button> */}
             <button
               className="btn btnPrimary"
               onClick={openCreate}
               style={{
                 height: 42,
                 padding: "0 16px",
                 display: "inline-flex",
                 alignItems: "center",
                 justifyContent: "center",
                 whiteSpace: "nowrap",
               }}
             >
               Add Driver
             </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: "grid", gap: 12 }}>
            <AdminSectionNav />
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
            <div style={{ minWidth: 220, flex: 1 }}>
              <input
                className="input"
                style={compactInputStyle}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name / phone / email"
              />
            </div>

            <div style={{ minWidth: 180 }}>
              <select
                className="input"
                style={compactInputStyle}
                value={enabled}
                onChange={(e) => setEnabled(e.target.value)}
              >
                <option value="">All enabled states</option>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>


            <div style={{ minWidth: 180 }}>
              <select
                className="input"
                style={compactInputStyle}
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">All vehicle types</option>
                <option value="SEDAN_4">Sedan</option>
                <option value="SUV_6">SUV 6</option>
                <option value="VAN_6">Van 6</option>
                <option value="VAN_10">Van 10</option>
                <option value="LUXURY">Luxury</option>
                <option value="ACCESSIBLE">Accessible</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" className="btn btnGhost" onClick={clearFilters}>
                Clear
              </button>
              <button type="submit" className="btn btnPrimary" disabled={loading}>
                {loading ? "Applying..." : "Apply"}
              </button>
            </div>
          </form>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 900 }}>Drivers</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {loading ? "Loading…" : `${drivers.length} on this page • ${totalElements} total`}
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
                      listAdminDrivers({
                        enabled: enabled === "" ? undefined : enabled === "true",
                        vehicleType: vehicleType || undefined,
                        q: q || undefined,
                        page: next,
                        size,
                        sort,
                      })
                        .then(setPageData)
                        .catch((e) => setError(e?.message || "Failed to load drivers."))
                        .finally(() => setLoading(false));
                    }, 0);
                  }}
                >
                  ← Prev
                </button>

                <div className="muted" style={{ fontSize: 13 }}>
                  Page {currentPage + 1}{totalPages ? ` / ${totalPages}` : ""}
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
                      listAdminDrivers({
                        enabled: enabled === "" ? undefined : enabled === "true",
                        vehicleType: vehicleType || undefined,
                        q: q || undefined,
                        page: next,
                        size,
                        sort,
                      })
                        .then(setPageData)
                        .catch((e) => setError(e?.message || "Failed to load drivers."))
                        .finally(() => setLoading(false));
                    }, 0);
                  }}
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="adminDesktopOnly" style={{ marginTop: 12, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "10px 8px" }}>Driver</th>
                    <th style={{ padding: "10px 8px" }}>Contact</th>
                    <th style={{ padding: "10px 8px" }}>Vehicle</th>
                    <th style={{ padding: "10px 8px" }}>Plate</th>
                    <th style={{ padding: "10px 8px" }}>Side #</th>
                    <th style={{ padding: "10px 8px" }}>Status</th>
                    <th style={{ padding: "10px 8px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {drivers.map((d) => (
                    <tr key={d.driverId} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 8px" }}>
                        <div style={{ fontWeight: 900 }}>{d.firstName} {d.lastName}</div>

                      </td>

                      <td style={{ padding: "10px 8px" }}>
                        <div>{d.phoneNumber || "—"}</div>
                        <div className="muted" style={{ fontSize: 12 }}>{d.email || "—"}</div>
                      </td>

                      <td style={{ padding: "10px 8px" }}>
                        <div style={{ fontWeight: 900 }}>{vehicleLabel(d.vehicleType)}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {[d.make, d.model, d.year].filter(Boolean).join(" ") || "—"}
                        </div>
                      </td>

                      <td style={{ padding: "10px 8px" }}>{d.vehiclePlate || "—"}</td>
                      <td style={{ padding: "10px 8px" }}>{d.sideNumber || "—"}</td>

                      <td style={{ padding: "10px 8px" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={statusBadgeStyle(d.enabled)}>
                            {d.enabled ? "Enabled" : "Disabled"}
                          </span>

                        </div>
                      </td>

                      <td style={{ padding: "10px 8px" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            className="btn btnGhost"
                            type="button"
//                             onClick={() => openEdit(d.driverId)}
                                onClick={() => {
                                  const ok = window.confirm(`Edit ${d.firstName} ${d.lastName}'s details?`);
                                  if (!ok) return;
                                  openEdit(d.driverId);
                                }}
                            disabled={loading}
                          >
                            Edit
                          </button>

                          <button
                            className={d.enabled ? "btn btnGhost" : "btn btnPrimary"}
                            type="button"
                            onClick={() => handleToggleEnabled(d)}
                            disabled={loading}
                          >
                            {d.enabled ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && drivers.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 14 }} className="muted">
                        No drivers found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="adminMobileOnly" style={{ marginTop: 12 }}>
              <div className="adminMobileList">
                {drivers.map((d) => (
                  <div key={d.driverId} className="card" style={{ padding: 14, borderRadius: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 16 }}>{d.firstName} {d.lastName}</div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={statusBadgeStyle(d.enabled)}>
                          {d.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontWeight: 900, fontSize: 12 }}>Contact</div>
                      <div className="muted" style={{ marginTop: 3 }}>{d.phoneNumber || "—"}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{d.email || "—"}</div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontWeight: 900, fontSize: 12 }}>Vehicle</div>
                      <div className="muted" style={{ marginTop: 3 }}>
                        {vehicleLabel(d.vehicleType)} • {[d.make, d.model, d.year].filter(Boolean).join(" ") || "—"}
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                      <div className="muted"><b style={{ color: "var(--text)" }}>Plate:</b> {d.vehiclePlate || "—"}</div>
                      <div className="muted"><b style={{ color: "var(--text)" }}>Side #:</b> {d.sideNumber || "—"}</div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                      <button
                        className="btn btnGhost"
                        type="button"
//                         onClick={() => openEdit(d.driverId)}
                            onClick={() => {
                              const ok = window.confirm(`Edit ${d.firstName} ${d.lastName}'s details?`);
                              if (!ok) return;
                              openEdit(d.driverId);
                            }}
                                                    disabled={loading}
                      >
                        Edit
                      </button>

                      <button
                        className={d.enabled ? "btn btnGhost" : "btn btnPrimary"}
                        type="button"
                        onClick={() => handleToggleEnabled(d)}
                        disabled={loading}
                      >
                        {d.enabled ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && drivers.length === 0 && (
                  <div className="card" style={{ padding: 14 }}>
                    <div className="muted">No drivers found for the selected filters.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <DriverFormModal
        open={modalOpen}
        mode={modalMode}
        driver={editingDriver}
        loading={modalLoading}
        onClose={() => {
          if (modalLoading) return;
          setModalOpen(false);
          setEditingDriver(null);
        }}
        onSubmit={handleSubmitModal}
      />

      <Footer brand={brand} />
    </div>
  );
}