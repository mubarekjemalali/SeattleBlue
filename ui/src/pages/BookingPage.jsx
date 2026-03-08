import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingsApi";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import TripDetailsCard from "./booking/TripDetailsCard";
import CustomerDetailsCard from "./booking/CustomerDetailsCard";
import FlatRateCard from "./booking/FlatRateCard";

const INITIAL_FORM = {
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
};

const INITIAL_FLAT = {
  routeId: "",
  vehicleType: "SEDAN_4",
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function isValidEmail(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

function normalizePhone(phone) {
  return (phone || "").replace(/[^\d]/g, "");
}

function isValidPhone(phone) {
  const digits = normalizePhone(phone);
  return digits.length >= 10 && digits.length <= 15;
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

function toLocalDateTimeString(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  return `${dateStr}T${timeStr}:00`;
}

function toLongOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const query = useQuery();

  const [mode, setMode] = useState("standard");
  const [form, setForm] = useState(INITIAL_FORM);
  const [flat, setFlat] = useState(INITIAL_FLAT);

  const [errors, setErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(null);

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

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearSubmissionMessages = () => {
    if (submitError) setSubmitError("");
    if (submitSuccess) setSubmitSuccess(null);
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const minTimeForSelectedDate = (() => {
    if (!form.pickupDate || form.pickupDate !== todayStr) return null;

    const now = new Date();
    const rounded = Math.ceil(now.getMinutes() / 5) * 5;
    now.setMinutes(rounded);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now.toTimeString().slice(0, 5);
  })();

  const validatePickupDateTimeLive = (nextPickupDate, nextPickupTime) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pickupDate;
      delete next.pickupTime;

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
      }

      return next;
    });
  };

  useEffect(() => {
    const pickup = query.get("pickup") || "";
    const dropoff = query.get("dropoff") || "";

    if (pickup || dropoff) {
      setForm((prev) => ({
        ...prev,
        pickup: pickup || prev.pickup,
        dropoff: dropoff || prev.dropoff,
      }));
    }
  }, [query]);

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

    const passengerCount = Number(form.passengers || 0);
    if (!passengerCount || passengerCount < 1) {
      nextErrors.passengers = "Please enter number of passengers.";
    } else {
      const cap = vehicleCapacity(form.vehicleType);
      if (passengerCount > cap) {
        nextErrors.passengers =
          `Selected vehicle cannot accommodate ${passengerCount} passengers. ` +
          "Please choose a larger vehicle.";
      }
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(null);

    if (mode === "flat") {
      if (!validateFlat()) return;
    } else if (!validateStandard()) {
      return;
    }

    if (mode === "standard") {
      const passengerCount = Number(form.passengers || 0);
      const cap = vehicleCapacity(form.vehicleType);

      const ok = window.confirm(
        `Please confirm your booking details:\n\n` +
          `Pickup: ${form.pickup}\n` +
          `Dropoff: ${form.dropoff}\n` +
          `Pickup date/time: ${form.pickupDate} ${form.pickupTime}\n` +
          `Vehicle: ${form.vehicleType} (capacity ${cap})\n` +
          `Passengers: ${passengerCount}\n\n` +
          "Click OK to submit, or Cancel to review."
      );
      if (!ok) return;
    }

    const dto = {
      firstName: form.firstName?.trim() || "",
      lastName: form.lastName?.trim() || "",
      phoneNumber: form.phone?.trim() || "",
      email: form.email?.trim() || "",
      pickupAddress: mode === "standard" ? form.pickup?.trim() || "" : null,
      pickupLat: null,
      pickupLng: null,
      dropoffAddress: mode === "standard" ? form.dropoff?.trim() || "" : null,
      dropoffLat: null,
      dropoffLng: null,
      pickupTime: mode === "standard" ? toLocalDateTimeString(form.pickupDate, form.pickupTime) : null,
      notes: form.notes?.trim() || null,
      fixedRouteId: mode === "flat" ? toLongOrNull(flat.routeId) : null,
      vehicleType: mode === "flat" ? flat.vehicleType : form.vehicleType,
    };

    try {
      setSubmitting(true);
      const response = await createBooking(dto);

      setSubmitSuccess(response);

      // Clear form after success to prevent duplicate submit of same payload.
      setForm(INITIAL_FORM);
      setFlat(INITIAL_FLAT);
      setErrors({});
      setFormErrorMessage("");

      scrollTop();
    } catch (err) {
      setSubmitError(err?.message || "Failed to create booking.");
      scrollTop();
    } finally {
      setSubmitting(false);
    }
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
              ? Back to Home
            </button>
          </div>

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
              onClick={() => {
                clearSubmissionMessages();
                setMode("standard");
              }}
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
              onClick={() => {
                clearSubmissionMessages();
                setMode("flat");
              }}
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

          {submitError && (
            <div
              className="card"
              style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #fecaca",
                background: "#fff5f5",
              }}
            >
              <div style={{ fontWeight: 800, color: "#b91c1c" }}>Submission failed</div>
              <div style={{ color: "#7f1d1d", marginTop: 4 }}>{submitError}</div>
            </div>
          )}

          {submitSuccess && (
            <div
              className="card"
              style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #bbf7d0",
                background: "#f0fdf4",
              }}
            >
              <div style={{ fontWeight: 900, color: "#166534" }}>Booking submitted successfully</div>
              <div className="muted" style={{ marginTop: 6 }}>
                Your booking request was sent. We will contact you with driver details soon.
              </div>
              {submitSuccess.bookingId && (
                <div style={{ marginTop: 8, fontWeight: 700, color: "#166534" }}>
                  Booking ID: {submitSuccess.bookingId}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <form onSubmit={handleSubmit} className="grid" style={{ gap: 16 }}>
            {mode === "standard" && (
              <>
                <TripDetailsCard
                  form={form}
                  errors={errors}
                  todayStr={todayStr}
                  minTimeForSelectedDate={minTimeForSelectedDate}
                  onPickupChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, pickup: v }));
                    if (v.trim()) clearError("pickup");
                  }}
                  onDropoffChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, dropoff: v }));
                    if (v.trim()) clearError("dropoff");
                  }}
                  onPickupDateChange={(e) => {
                    clearSubmissionMessages();
                    const nextDate = e.target.value;
                    setForm((p) => {
                      const next = { ...p, pickupDate: nextDate };
                      validatePickupDateTimeLive(next.pickupDate, next.pickupTime);
                      return next;
                    });
                  }}
                  onPickupTimeChange={(e) => {
                    clearSubmissionMessages();
                    const nextTime = e.target.value;
                    setForm((p) => {
                      const next = { ...p, pickupTime: nextTime };
                      validatePickupDateTimeLive(next.pickupDate, next.pickupTime);
                      return next;
                    });
                  }}
                  onVehicleTypeChange={(e) => {
                    clearSubmissionMessages();
                    setForm((p) => ({ ...p, vehicleType: e.target.value }));
                    clearError("vehicleType");
                  }}
                  onPassengersChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, passengers: v }));
                    clearError("passengers");
                  }}
                  onPassengersBlur={() => {
                    if (!form.passengers) setForm((p) => ({ ...p, passengers: "1" }));
                  }}
                  onNotesChange={(e) => {
                    clearSubmissionMessages();
                    setForm((p) => ({ ...p, notes: e.target.value }));
                  }}
                />

                <CustomerDetailsCard
                  form={form}
                  errors={errors}
                  onFirstNameChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, firstName: v }));
                    if (v.trim()) clearError("firstName");
                  }}
                  onLastNameChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, lastName: v }));
                    if (v.trim()) clearError("lastName");
                  }}
                  onPhoneChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, phone: v }));
                    if (isValidPhone(v)) clearError("phone");
                  }}
                  onEmailChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, email: v }));
                    if (isValidEmail(v)) clearError("email");
                  }}
                />
              </>
            )}

            {mode === "flat" && (
              <>
                <FlatRateCard
                  flat={flat}
                  errors={errors}
                  onRouteChange={(e) => {
                    clearSubmissionMessages();
                    setFlat((p) => ({ ...p, routeId: e.target.value }));
                    clearError("routeId");
                  }}
                  onFlatVehicleTypeChange={(e) => {
                    clearSubmissionMessages();
                    setFlat((p) => ({ ...p, vehicleType: e.target.value }));
                    clearError("flatVehicleType");
                  }}
                />

                <CustomerDetailsCard
                  form={form}
                  errors={errors}
                  onFirstNameChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, firstName: v }));
                    if (v.trim()) clearError("firstName");
                  }}
                  onLastNameChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, lastName: v }));
                    if (v.trim()) clearError("lastName");
                  }}
                  onPhoneChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, phone: v }));
                    if (isValidPhone(v)) clearError("phone");
                  }}
                  onEmailChange={(e) => {
                    clearSubmissionMessages();
                    const v = e.target.value;
                    setForm((p) => ({ ...p, email: v }));
                    if (isValidEmail(v)) clearError("email");
                  }}
                />
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

                <button className="btn btnPrimary" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Booking"}
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
