import { useMemo, useState } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitContactMessage } from "../api/ContactApi";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phoneNumber: "",
  subject: "",
  bookingReference: "",
  message: "",
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.subject.trim()) errors.subject = "Subject is required.";
  if (!form.message.trim()) errors.message = "Message is required.";

  return errors;
}

export default function ContactPage() {
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

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const inputStyle = {
    width: "100%",
    height: 44,
    borderRadius: 12,
    border: "1px solid var(--border)",
    padding: "10px 12px",
    background: "#fff",
    color: "var(--text)",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: 140,
    borderRadius: 12,
    border: "1px solid var(--border)",
    padding: "12px",
    background: "#fff",
    color: "var(--text)",
    resize: "vertical",
    font: "inherit",
  };

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);

      await submitContactMessage({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
        subject: form.subject,
        bookingReference: form.bookingReference.trim() || null,
        message: form.message.trim(),
      });

      setInfo("Your message was sent successfully. Our team will follow up as soon as possible.");
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err?.message || "Failed to submit your message.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (key) =>
    errors[key] ? (
      <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{errors[key]}</div>
    ) : null;

  return (
    <div>
      <TopBar brand={brand} />
      <Navbar brand={brand} />

      <section
        className="section"
        style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff)" }}
      >
        <div className="container" style={{ display: "grid", gap: 12 }}>
          <div>
            <div className="kicker">Contact</div>
            <h1 style={{ margin: "4px 0 0", fontSize: 32, fontWeight: 900 }}>
              Contact Seattle Blue Cab
            </h1>
            <div className="muted" style={{ lineHeight: 1.6, marginTop: 6, maxWidth: 760 }}>
              Have a question, complaint, lost-item report, or booking-related issue? Send us a
              message and our team will follow up.
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
       <div className="container contactLayout">
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Send a message</div>

            {error && (
              <div
                className="card"
                style={{ padding: 12, border: "1px solid #fecaca", background: "#fff5f5", marginBottom: 12 }}
              >
                <div style={{ fontWeight: 800, color: "#b91c1c" }}>Error</div>
                <div style={{ color: "#7f1d1d", marginTop: 4 }}>{error}</div>
              </div>
            )}

            {info && !error && (
              <div
                className="card"
                style={{ padding: 12, border: "1px solid #bbf7d0", background: "#f0fdf4", marginBottom: 12 }}
              >
                <div style={{ fontWeight: 900, color: "#166534" }}>Message ready</div>
                <div className="muted" style={{ marginTop: 4 }}>{info}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid2" style={{ gap: 12 }}>
                <div>
                  <input
                    className="input"
                    style={inputStyle}
                    value={form.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    placeholder="Full name"
                  />
                  {renderError("fullName")}
                </div>

                <div>
                  <input
                    className="input"
                    style={inputStyle}
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="Email"
                  />
                  {renderError("email")}
                </div>

                <div>
                  <input
                    className="input"
                    style={inputStyle}
                    value={form.phoneNumber}
                    onChange={(e) => onChange("phoneNumber", e.target.value)}
                    placeholder="Phone number (optional)"
                  />
                </div>

                <div>
                  <select
                    className="input"
                    style={inputStyle}
                    value={form.subject}
                    onChange={(e) => onChange("subject", e.target.value)}
                  >
                    <option value="">Select a reason</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Lost Item">Lost Item</option>
                    <option value="Booking Issue">Booking Issue</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Other">Other</option>
                  </select>
                  {renderError("subject")}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <input
                    className="input"
                    style={inputStyle}
                    value={form.bookingReference}
                    onChange={(e) => onChange("bookingReference", e.target.value)}
                    placeholder="Booking reference (optional)"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <textarea
                    style={textareaStyle}
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                    placeholder="Tell us how we can help."
                  />
                  {renderError("message")}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button type="submit" className="btn btnPrimary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Reach us directly</div>
              <div className="muted" style={{ lineHeight: 1.7 }}>
                For urgent ride issues, billing questions, or immediate support, you can also use the
                contact details below.
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                <a className="pill" href={`tel:${brand.phoneDial}`}>📞 {brand.phoneDisplay}</a>
                <a className="pill" href={`mailto:${brand.email}`}>✉️ {brand.email}</a>
                <span className="pill">📍 {brand.addressShort}</span>
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Common reasons to contact us</div>
              <div className="muted" style={{ lineHeight: 1.8 }}>
                Lost item reports, complaints, booking changes, billing concerns, account questions,
                and general service inquiries.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  );
}