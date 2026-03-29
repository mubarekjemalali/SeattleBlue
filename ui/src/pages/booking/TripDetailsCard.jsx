import React from "react";

/**
 * TripDetailsCard
 * - Pure UI component (no local state).
 * - All values/handlers come from parent (BookingPage).
 * - Easy to swap inputs later (e.g., autocomplete component).
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

export default function TripDetailsCard({
  form,
  errors,
  todayStr,
  minTimeForSelectedDate,
  onPickupChange,
  onDropoffChange,
  onPickupDateChange,
  onPickupTimeChange,
  onVehicleTypeChange,
  onPassengersChange,
  onPassengersBlur,
  onNotesChange,
}) {
  return (
    <SectionCard title="Trip details" subtitle="Where and when?">
      <div className="grid grid2" style={{ gap: 12 }}>
        <div>
          <div style={labelStyle}>Pickup (required)</div>
          {/* Replace later with autocomplete input if desired */}
          <input
            autoComplete="off"
            value={form.pickup}
            onChange={onPickupChange}
            placeholder="Enter pickup location"
            style={inputStyle(!!errors.pickup)}
          />
          {errors.pickup && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {errors.pickup}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Dropoff (required)</div>
          {/* Replace later with autocomplete input if desired */}
          <input
            autoComplete="off"
            value={form.dropoff}
            onChange={onDropoffChange}
            placeholder="Enter dropoff location"
            style={inputStyle(!!errors.dropoff)}
          />
          {errors.dropoff && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {errors.dropoff}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Pickup date (required)</div>
          <input
            type="date"
            min={todayStr}
            value={form.pickupDate}
            onChange={onPickupDateChange}
            style={inputStyle(!!errors.pickupDate)}
          />
          {errors.pickupDate && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {errors.pickupDate}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Pickup time (required)</div>
          <input
            type="time"
            min={minTimeForSelectedDate || undefined}
            value={form.pickupTime}
            onChange={onPickupTimeChange}
            style={inputStyle(!!errors.pickupTime)}
          />
          {errors.pickupTime && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {errors.pickupTime}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Vehicle type (required)</div>
          <select
            value={form.vehicleType}
            onChange={onVehicleTypeChange}
            style={inputStyle(!!errors.vehicleType)}
          >
            {/* Easy to add more vehicle types later */}
            <option value="SEDAN_4">Sedan (4 seats)</option>
            <option value="SUV_6">SUV (6 seats)</option>
            <option value="VAN_10">Van (10 seats)</option>
          </select>
          {errors.vehicleType && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {errors.vehicleType}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Passengers</div>
          <input
            type="number"
            min={1}
            max={12}
            value={form.passengers}
            onChange={onPassengersChange}
            onBlur={onPassengersBlur}
            style={inputStyle(!!errors.passengers)}
          />
          {errors.passengers && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {errors.passengers}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Special instructions</div>
          <input
            autoComplete="off"
            value={form.notes}
            onChange={onNotesChange}
            placeholder="Optional notes (gate code, luggage, etc.)"
            style={inputStyle(false)}
          />
        </div>
      </div>

      <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
        Next enhancement: address autocomplete + map preview + distance estimate.
      </div>
    </SectionCard>
  );
}