import React from "react";

/**
 * CustomerDetailsCard
 * - Pure UI; validation handled by parent.
 * - Comments included so you can change/replace fields later.
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
export default function CustomerDetailsCard({
  form,
  errors,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onEmailChange,
}) {
  const safeForm = form ?? { firstName: "", lastName: "", phone: "", email: "" };
  const safeErrors = errors ?? {};

  return (
    <SectionCard title="Customer details" subtitle="How can we contact you?">
      <div className="grid grid2" style={{ gap: 12 }}>
        <div>
          <div style={labelStyle}>First name (required)</div>
          <input
            autoComplete="off"
            value={safeForm.firstName}
            onChange={onFirstNameChange}
            placeholder="First name"
            style={inputStyle(!!safeErrors.firstName)}
          />
          {safeErrors.firstName && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {safeErrors.firstName}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Last name (required)</div>
          <input
            autoComplete="off"
            value={safeForm.lastName}
            onChange={onLastNameChange}
            placeholder="Last name"
            style={inputStyle(!!safeErrors.lastName)}
          />
          {safeErrors.lastName && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {safeErrors.lastName}
            </div>
          )}
        </div>

        <div>
          <div style={labelStyle}>Phone (required)</div>
          <input
            autoComplete="off"
            value={safeForm.phone}
            onChange={onPhoneChange}
            placeholder="(206) 555-0123"
            style={inputStyle(!!safeErrors.phone)}
          />
          {safeErrors.phone && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {safeErrors.phone}
            </div>
          )}
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <div style={labelStyle}>Email (required)</div>
          <input
            autoComplete="off"
            value={safeForm.email}
            onChange={onEmailChange}
            placeholder="you@example.com"
            style={inputStyle(!!safeErrors.email)}
          />
          {safeErrors.email && (
            <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
              {safeErrors.email}
            </div>
          )}
        </div>
      </div>

      <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
        Email is required because we send confirmation + status updates.
      </div>
    </SectionCard>
  );
}