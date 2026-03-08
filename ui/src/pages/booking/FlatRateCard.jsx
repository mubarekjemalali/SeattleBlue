import React from "react";

/**
 * FlatRateCard
 * - Pure UI. Uses `flat` state from parent.
 * - Routes are demo now; later replace with backend-loaded route list.
 */

const labelStyle = { fontSize: 12, color: "var(--muted)", marginBottom: 6 };

function inputStyle(hasError) {
  return {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: hasError ? "2px solid #ef4444" : "1px solid var(--border)",
    outline: "none",
    fontSize: 16,
    background: "#fff",
    boxSizing: "border-box",
  };
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ marginBottom: 10 }}>
        <div className="kicker">{title}</div>
        <div className="h2">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

export default function FlatRateCard({
  flat,
  errors,
  onRouteChange,
  onFlatVehicleTypeChange,
}) {
  const safeFlat = flat ?? { routeId: "", vehicleType: "SEDAN_4" };
  const safeErrors = errors ?? {};

  return (
    <SectionCard
      title="Flat-rate options"
      subtitle="Pick a fixed route and vehicle type"
    >
      <div className="grid grid2" style={{ gap: 12 }}>
        <div>
          <div style={labelStyle}>Route (required)</div>
          <select
            value={safeFlat.routeId}
            onChange={onRouteChange}
            style={inputStyle(!!safeErrors.routeId)}
          >
            <option value="">Select a route</option>
            <option value="1">Airport → Downtown </option>
            <option value="2">Downtown → Airport </option>
          </select>
          {safeErrors.routeId && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {safeErrors.routeId}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Vehicle type (required)</div>
          <select
            value={safeFlat.vehicleType}
            onChange={onFlatVehicleTypeChange}
            style={inputStyle(!!safeErrors.flatVehicleType)}
          >
            <option value="SEDAN_4">Sedan (4 seats)</option>
            <option value="SUV_6">SUV (6 seats)</option>
            <option value="VAN_10">Van (10 seats)</option>
          </select>
          {safeErrors.flatVehicleType && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {safeErrors.flatVehicleType}
            </div>
          )}
        </div>
      </div>

      <div
        className="card"
        style={{ marginTop: 12, padding: 12, background: "var(--blue-50)" }}
      >
        <div style={{ fontWeight: 900 }}>Estimated flat-rate (demo)</div>
        <div className="muted" style={{ marginTop: 4 }}>
          Once we connect the backend routes/prices, we’ll show the exact flat-rate here.
        </div>
      </div>

      <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
        Next enhancement: fetch routes + prices from backend and auto-fill pickup/dropoff
        based on selected route.
      </div>
    </SectionCard>
  );
}