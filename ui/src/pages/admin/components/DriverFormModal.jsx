import { useEffect, useMemo, useState } from "react";

const VEHICLE_OPTIONS = [
  { value: "SEDAN_4", label: "Sedan" },
  { value: "SUV_6", label: "SUV 6" },
  { value: "VAN_6", label: "Van 6" },
  { value: "VAN_10", label: "Van 10" },
  { value: "LUXURY", label: "Luxury" },
  { value: "ACCESSIBLE", label: "Accessible" },
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  vehicle: {
    vehicleType: "",
    vehiclePlate: "",
    sideNumber: "",
    make: "",
    model: "",
    year: "",
  },
};

function buildInitialForm(driver) {
  if (!driver) return INITIAL_FORM;

  return {
    firstName: driver.firstName || "",
    lastName: driver.lastName || "",
    phoneNumber: driver.phoneNumber || "",
    email: driver.email || "",
    vehicle: {
      vehicleType: driver.vehicleType || "",
      vehiclePlate: driver.vehiclePlate || "",
      sideNumber: driver.sideNumber || "",
      make: driver.make || "",
      model: driver.model || "",
      year: driver.year ?? "",
    },
  };
}

function validate(form) {
  const next = {};

  if (!form.firstName.trim()) next.firstName = "First name is required.";
  if (!form.lastName.trim()) next.lastName = "Last name is required.";
  if (!form.phoneNumber.trim()) next.phoneNumber = "Phone number is required.";

  if (!form.email.trim()) {
    next.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    next.email = "Enter a valid email address.";
  }

  if (!form.vehicle.vehicleType) next.vehicleType = "Vehicle type is required.";
  if (!form.vehicle.vehiclePlate.trim()) next.vehiclePlate = "Vehicle plate is required.";
  if (!form.vehicle.sideNumber.trim()) next.sideNumber = "Side number is required.";

  if (form.vehicle.year !== "") {
    const n = Number(form.vehicle.year);
    if (!Number.isInteger(n) || n < 1980 || n > 2100) {
      next.year = "Year must be between 1980 and 2100.";
    }
  }

  return next;
}

function fieldError(errors, key) {
  return errors[key] ? (
    <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{errors[key]}</div>
  ) : null;
}

export default function DriverFormModal({
  open,
  mode = "create",
  driver = null,
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const title = mode === "edit" ? "Edit Driver" : "Add Driver";

  useEffect(() => {
    if (!open) return;
    setForm(buildInitialForm(driver));
    setErrors({});
  }, [open, driver]);

  const cardStyle = useMemo(
    () => ({
      width: "min(920px, calc(100vw - 24px))",
      maxHeight: "calc(100vh - 24px)",
      overflowY: "auto",
      background: "#fff",
      borderRadius: 18,
      border: "1px solid var(--border)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      padding: 18,
    }),
    []
  );

  const inputStyle = {
    width: "100%",
    height: 44,
    borderRadius: 12,
    border: "1px solid var(--border)",
    padding: "10px 12px",
    background: "#fff",
    color: "var(--text)",
  };

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const onVehicleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [key]: value,
      },
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };


    const handleSubmit = async (e) => {
      e.preventDefault();

      const nextErrors = validate(form);
      setErrors(nextErrors);

      // Stop if validation failed
      if (Object.keys(nextErrors).length > 0) return;

      // 👉 ADD THIS BLOCK (only for edit mode)
      if (mode === "edit") {
        const ok = window.confirm(
          `Are you sure you want to save changes to ${form.firstName.trim()} ${form.lastName.trim()}?`
        );

        if (!ok) return; // user cancelled → stop here
      }

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        vehicle: {
          vehicleType: form.vehicle.vehicleType,
          vehiclePlate: form.vehicle.vehiclePlate.trim(),
          sideNumber: form.vehicle.sideNumber.trim(),
          make: form.vehicle.make.trim() || null,
          model: form.vehicle.model.trim() || null,
          year: form.vehicle.year === "" ? null : Number(form.vehicle.year),
        },
      };

      await onSubmit(payload);
    };
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (loading) return;
        onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(15, 23, 42, 0.45)",
        display: "grid",
        placeItems: "center",
        padding: 12,
      }}
    >
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div className="kicker">Admin</div>
            <h2 style={{ margin: "4px 0 0", fontSize: 24 }}>{title}</h2>
          </div>

          <button
            type="button"
            className="btn btnGhost"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Driver details</div>

            <div className="grid grid2" style={{ gap: 12 }}>
              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  placeholder="First name"
                />
                {fieldError(errors, "firstName")}
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  placeholder="Last name"
                />
                {fieldError(errors, "lastName")}
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.phoneNumber}
                  onChange={(e) => onChange("phoneNumber", e.target.value)}
                  placeholder="Phone number"
                />
                {fieldError(errors, "phoneNumber")}
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="Email"
                />
                {fieldError(errors, "email")}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 16, marginTop: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Vehicle details</div>

            <div className="grid grid2" style={{ gap: 12 }}>
              <div>
                <select
                  className="input"
                  style={inputStyle}
                  value={form.vehicle.vehicleType}
                  onChange={(e) => onVehicleChange("vehicleType", e.target.value)}
                >
                  <option value="">Select vehicle type</option>
                  {VEHICLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {fieldError(errors, "vehicleType")}
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.vehicle.vehiclePlate}
                  onChange={(e) => onVehicleChange("vehiclePlate", e.target.value)}
                  placeholder="Vehicle plate"
                />
                {fieldError(errors, "vehiclePlate")}
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.vehicle.sideNumber}
                  onChange={(e) => onVehicleChange("sideNumber", e.target.value)}
                  placeholder="Side number"
                />
                {fieldError(errors, "sideNumber")}
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.vehicle.year}
                  onChange={(e) => onVehicleChange("year", e.target.value)}
                  placeholder="Year (optional)"
                />
                {fieldError(errors, "year")}
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.vehicle.make}
                  onChange={(e) => onVehicleChange("make", e.target.value)}
                  placeholder="Make (optional)"
                />
              </div>

              <div>
                <input
                  className="input"
                  style={inputStyle}
                  value={form.vehicle.model}
                  onChange={(e) => onVehicleChange("model", e.target.value)}
                  placeholder="Model (optional)"
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button type="button" className="btn btnGhost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btnPrimary" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Save changes" : "Create driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}