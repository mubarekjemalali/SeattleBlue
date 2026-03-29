import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Helper: parse query string params (pickup/dropoff).
 */
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

/**
 * Basic validators (simple, not overly strict).
 * We can strengthen later if needed.
 */
function isValidEmail(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

function normalizePhone(phone) {
  return (phone || "").replace(/[^\d]/g, "");
}

function isValidPhone(phone) {
  const digits = normalizePhone(phone);
  // US-ish: allow 10 to 15 digits to stay flexible
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * IMPORTANT: Keep UI helper constants/functions OUTSIDE the component.
 * If you define React components inside BookingPage(), they get a new identity
 * on each render (each keystroke), which can cause inputs to lose focus.
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

function vehicleCapacity(vehicleType) {
  switch (vehicleType) {
    case "SEDAN_4":
      return 4;
    case "SUV_6":
      return 6;
    case "VAN_10":
      return 10;
    default:
      return 4;
  }
}

export default function BookingPage() {
  const navigate = useNavigate();
  const query = useQuery();

  // Tabs: "standard" or "flat"
  const [mode, setMode] = useState("standard");

  // Booking form state (Standard Ride)
  const [form, setForm] = useState({
    pickup: "",
    dropoff: "",
    pickupDate: "",
    pickupTime: "",
    vehicleType: "SEDAN_4",
    passengers: "1",
    notes: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // Flat-rate selections (UI now, wiring later)
  const [flat, setFlat] = useState({
    routeId: "",
    vehicleType: "SEDAN_4",
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState("");

  // Brand (same as homepage, keep consistent)
  const brand = useMemo(
    () => ({
      companyName: "Seattle Blue Cab",
      phoneDisplay: "(206) 555-0123",
      phoneDial: "+12065550123",
      email: "info@seattlebluecab.com",
      addressShort: "Seattle, WA",
      socials: {
        facebook: "#",
        instagram: "#",
        x: "#",
      },
    }),
    []
  );

  /**
   * Utility: clear a single error key immediately when user fixes that field.
   */
  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const todayStr = new Date().toISOString().slice(0, 10);

  const minTimeForSelectedDate = (() => {
    if (!form.pickupDate) return null;
    if (form.pickupDate !== todayStr) return null;

    // Current time in HH:mm (rounded up to next 5 minutes to be practical)
    const now = new Date();
    const minutes = now.getMinutes();
    const rounded = Math.ceil(minutes / 5) * 5;
    now.setMinutes(rounded);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now.toTimeString().slice(0, 5); // "HH:mm"
  })();

  /**
   * Live validation for pickup date+time.
   * - Clears the error as soon as values become valid.
   * - Re-adds only if still invalid.
   */
  const validatePickupDateTimeLive = (nextPickupDate, nextPickupTime) => {
    setErrors((prev) => {
      const next = { ...prev };

      // Clear old messages first (we’ll re-add only if still invalid)
      delete next.pickupDate;
      delete next.pickupTime;

      // If neither touched, don't show anything yet.
      // (But once a user starts interacting, we want feedback.)
      const touched = !!nextPickupDate || !!nextPickupTime;
      if (!touched) return next;

      if (!nextPickupDate) {
        next.pickupDate = "Pickup date is required.";
        return next;
      }

      if (!nextPickupTime) {
        next.pickupTime = "Pickup time is required.";
        return next;
      }

      const selected = new Date(`${nextPickupDate}T${nextPickupTime}`);
      if (Number.isNaN(selected.getTime())) {
        next.pickupTime = "Please enter a valid pickup time.";
        return next;
      }

      if (selected.getTime() < Date.now()) {
        next.pickupTime = "Please choose a future pickup time.";
        return next;
      }

      // valid => no errors
      return next;
    });
  };

  /**
   * Prefill pickup/dropoff from query string if present:
   * /booking?pickup=...&dropoff=...
   */
  useEffect(() => {
    const pickup = query.get("pickup") || "";
    const dropoff = query.get("dropoff") || "";

    // Only overwrite if query provides values (avoid wiping user input)
    if (pickup || dropoff) {
      setForm((prev) => ({
        ...prev,
        pickup: pickup || prev.pickup,
        dropoff: dropoff || prev.dropoff,
      }));
    }
  }, [query]);

  /**
   * Validate Standard Ride form (submit-time).
   */
  const validateStandard = () => {
    const nextErrors = {};

    if (!form.pickup.trim()) nextErrors.pickup = "Pickup is required.";
    if (!form.dropoff.trim()) nextErrors.dropoff = "Dropoff is required.";
    if (!form.pickupDate) nextErrors.pickupDate = "Date is required.";
    if (!form.pickupTime) nextErrors.pickupTime = "Time is required.";
    if (!form.vehicleType) nextErrors.vehicleType = "Vehicle type is required.";
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (form.phone && !isValidPhone(form.phone)) nextErrors.phone = "Enter a valid phone number.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (form.email && !isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";

    // Passengers validation
    const passengerCount = Number(form.passengers || 0);
    if (!passengerCount || passengerCount < 1) {
      nextErrors.passengers = "Please enter number of passengers.";
    } else {
      const cap = vehicleCapacity(form.vehicleType);
      if (passengerCount > cap) {
        nextErrors.passengers =
          `Selected vehicle cannot accommodate ${passengerCount} passengers. ` +
          `Please choose a larger vehicle.`;
      }
    }

    // Prevent past date/time
    if (form.pickupDate && form.pickupTime) {
      const selected = new Date(`${form.pickupDate}T${form.pickupTime}`);
      if (!Number.isNaN(selected.getTime()) && selected.getTime() < Date.now()) {
        nextErrors.pickupTime = "Please choose a future pickup time.";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrorMessage("Please complete the required fields highlighted below.");
      scrollTop();
      return false;
    }

    setFormErrorMessage("");
    return true;
  };

  /**
   * Validate Flat-rate tab inputs (submit-time).
   */
  const validateFlat = () => {
    const nextErrors = {};
    if (!flat.routeId) nextErrors.routeId = "Please select a route.";
    if (!flat.vehicleType) nextErrors.flatVehicleType = "Please select a vehicle type.";

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (form.phone && !isValidPhone(form.phone)) nextErrors.phone = "Enter a valid phone number.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (form.email && !isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrorMessage("Please complete the required fields highlighted below.");
      scrollTop();
      return false;
    }

    setFormErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "flat") {
      if (!validateFlat()) return;
      alert("✅ Flat-rate selection validated. Next step: load routes from backend and create booking.");
      return;
    }

    if (!validateStandard()) return;

    const passengerCount = Number(form.passengers || 0);
    const cap = vehicleCapacity(form.vehicleType);

    const ok = window.confirm(
      `Please confirm your booking details:\n\n` +
        `Pickup: ${form.pickup}\n` +
        `Dropoff: ${form.dropoff}\n` +
        `Pickup date/time: ${form.pickupDate} ${form.pickupTime}\n` +
        `Vehicle: ${form.vehicleType} (capacity ${cap})\n` +
        `Passengers: ${passengerCount}\n\n` +
        `Click OK to submit, or Cancel to review.`
    );

    if (!ok) return;

    // Next step: call backend and show confirmation screen.
  };

  return (
    <div>
      <TopBar brand={brand} />
      <Navbar brand={brand} onBookNow={() => navigate("/booking")} />

      <section
        className="section"
        style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff)" }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="kicker">Booking</div>
              <h1 className="h1" style={{ marginBottom: 6 }}>
                Book a Ride
              </h1>
              <div className="muted" style={{ lineHeight: 1.6 }}>
                Choose a standard ride or select a flat-rate route. Confirmation emails will be sent
                after submission.
              </div>
            </div>

            <button className="btn btnGhost" onClick={() => navigate("/")}>
              ← Back to Home
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
            <button
              type="button"
              className="btn"
              onClick={() => setMode("standard")}
              style={{
                flex: 1,
                minWidth: 160,
                background: mode === "standard" ? "var(--blue-900)" : "transparent",
                color: mode === "standard" ? "#fff" : "var(--text)",
                border: mode === "standard" ? "0" : "1px solid var(--border)",
              }}
            >
              Standard Ride
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => setMode("flat")}
              style={{
                flex: 1,
                minWidth: 160,
                background: mode === "flat" ? "var(--blue-900)" : "transparent",
                color: mode === "flat" ? "#fff" : "var(--text)",
                border: mode === "flat" ? "0" : "1px solid var(--border)",
              }}
            >
              Flat-Rate Routes
            </button>
          </div>

          {/* Error banner */}
          {formErrorMessage && (
            <div
              className="card"
              style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #fecaca",
                background: "#fff5f5",
              }}
            >
              <div style={{ fontWeight: 800, color: "#b91c1c" }}>Action needed</div>
              <div style={{ color: "#7f1d1d", marginTop: 4 }}>{formErrorMessage}</div>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <form onSubmit={handleSubmit} className="grid" style={{ gap: 16 }}>
            {mode === "standard" && (
              <>
                <SectionCard title="Trip details" subtitle="Where and when?">
                  <div className="grid grid2" style={{ gap: 12 }}>
                    <div>
                      <div style={labelStyle}>Pickup (required)</div>
                      <input
                        autoComplete="off"
                        value={form.pickup}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, pickup: v }));
                          if (v.trim()) clearError("pickup");
                        }}
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
                      <input
                        autoComplete="off"
                        value={form.dropoff}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, dropoff: v }));
                          if (v.trim()) clearError("dropoff");
                        }}
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
                        onChange={(e) => {
                          const nextDate = e.target.value;
                          setForm((p) => {
                            const next = { ...p, pickupDate: nextDate };
                            validatePickupDateTimeLive(next.pickupDate, next.pickupTime);
                            return next;
                          });
                        }}
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
                        onChange={(e) => {
                          const nextTime = e.target.value;
                          setForm((p) => {
                            const next = { ...p, pickupTime: nextTime };
                            validatePickupDateTimeLive(next.pickupDate, next.pickupTime);
                            return next;
                          });
                        }}
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
                        onChange={(e) => {
                          setForm((p) => ({ ...p, vehicleType: e.target.value }));
                          clearError("vehicleType");
                        }}
                        style={inputStyle(!!errors.vehicleType)}
                      >
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
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, passengers: v }));
                          clearError("passengers");
                        }}
                        onBlur={() => {
                          if (!form.passengers) setForm((p) => ({ ...p, passengers: "1" }));
                        }}
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
                        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="Optional notes (gate code, luggage, etc.)"
                        style={inputStyle(false)}
                      />
                    </div>
                  </div>

                  <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
                    Next enhancement: address autocomplete + map preview + distance estimate.
                  </div>
                </SectionCard>

                <SectionCard title="Customer details" subtitle="How can we contact you?">
                  <div className="grid grid2" style={{ gap: 12 }}>
                    <div>
                      <div style={labelStyle}>First name (required)</div>
                      <input
                        autoComplete="off"
                        value={form.firstName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, firstName: v }));
                          if (v.trim()) clearError("firstName");
                        }}
                        placeholder="First name"
                        style={inputStyle(!!errors.firstName)}
                      />
                      {errors.firstName && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={labelStyle}>Last name (required)</div>
                      <input
                        autoComplete="off"
                        value={form.lastName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, lastName: v }));
                          if (v.trim()) clearError("lastName");
                        }}
                        placeholder="Last name"
                        style={inputStyle(!!errors.lastName)}
                      />
                      {errors.lastName && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.lastName}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={labelStyle}>Phone (required)</div>
                      <input
                        autoComplete="off"
                        value={form.phone}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, phone: v }));
                          // Clear only when valid
                          if (isValidPhone(v)) clearError("phone");
                        }}
                        placeholder="(206) 555-0123"
                        style={inputStyle(!!errors.phone)}
                      />
                      {errors.phone && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.phone}
                        </div>
                      )}
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={labelStyle}>Email (required)</div>
                      <input
                        autoComplete="off"
                        value={form.email}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, email: v }));
                          if (isValidEmail(v)) clearError("email");
                        }}
                        placeholder="you@example.com"
                        style={inputStyle(!!errors.email)}
                      />
                      {errors.email && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
                    Email is required because we send confirmation + status updates.
                  </div>
                </SectionCard>
              </>
            )}

            {mode === "flat" && (
              <>
                <SectionCard title="Flat-rate options" subtitle="Pick a fixed route and vehicle type">
                  <div className="grid grid2" style={{ gap: 12 }}>
                    <div>
                      <div style={labelStyle}>Route (required)</div>
                      <select
                        value={flat.routeId}
                        onChange={(e) => {
                          setFlat((p) => ({ ...p, routeId: e.target.value }));
                          clearError("routeId");
                        }}
                        style={inputStyle(!!errors.routeId)}
                      >
                        <option value="">Select a route</option>
                        <option value="demo_airport_downtown">Airport → Downtown (demo)</option>
                        <option value="demo_downtown_airport">Downtown → Airport (demo)</option>
                      </select>
                      {errors.routeId && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.routeId}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={labelStyle}>Vehicle type (required)</div>
                      <select
                        value={flat.vehicleType}
                        onChange={(e) => {
                          setFlat((p) => ({ ...p, vehicleType: e.target.value }));
                          clearError("flatVehicleType");
                        }}
                        style={inputStyle(!!errors.flatVehicleType)}
                      >
                        <option value="SEDAN_4">Sedan (4 seats)</option>
                        <option value="SUV_6">SUV (6 seats)</option>
                        <option value="VAN_10">Van (10 seats)</option>
                      </select>
                      {errors.flatVehicleType && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.flatVehicleType}
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Customer details" subtitle="We will email you confirmation">
                  <div className="grid grid2" style={{ gap: 12 }}>
                    <div>
                      <div style={labelStyle}>First name (required)</div>
                      <input
                        autoComplete="off"
                        value={form.firstName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, firstName: v }));
                          if (v.trim()) clearError("firstName");
                        }}
                        placeholder="First name"
                        style={inputStyle(!!errors.firstName)}
                      />
                      {errors.firstName && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={labelStyle}>Last name (required)</div>
                      <input
                        autoComplete="off"
                        value={form.lastName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, lastName: v }));
                          if (v.trim()) clearError("lastName");
                        }}
                        placeholder="Last name"
                        style={inputStyle(!!errors.lastName)}
                      />
                      {errors.lastName && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.lastName}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={labelStyle}>Phone (required)</div>
                      <input
                        autoComplete="off"
                        value={form.phone}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, phone: v }));
                          if (isValidPhone(v)) clearError("phone");
                        }}
                        placeholder="(206) 555-0123"
                        style={inputStyle(!!errors.phone)}
                      />
                      {errors.phone && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.phone}
                        </div>
                      )}
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={labelStyle}>Email (required)</div>
                      <input
                        autoComplete="off"
                        value={form.email}
                        onChange={(e) => {
                          const v = e.target.value;
                          setForm((p) => ({ ...p, email: v }));
                          if (isValidEmail(v)) clearError("email");
                        }}
                        placeholder="you@example.com"
                        style={inputStyle(!!errors.email)}
                      />
                      {errors.email && (
                        <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            <div className="card" style={{ padding: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 900 }}>Ready to submit?</div>
                </div>

                <button className="btn btnPrimary" type="submit">
                  Submit Booking
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  );
}