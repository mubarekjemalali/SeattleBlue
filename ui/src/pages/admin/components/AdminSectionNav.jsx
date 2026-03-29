import { NavLink } from "react-router-dom";

const linkBaseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "10px 16px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  border: "1px solid var(--border)",
  transition: "all 0.2s ease",
};

const inactiveStyle = {
  ...linkBaseStyle,
  background: "#fff",
  color: "var(--text)",
};

const activeStyle = {
  ...linkBaseStyle,
  background: "var(--blue-900)",
  color: "#fff",
  border: "1px solid var(--blue-900)",
};

const disabledStyle = {
  ...linkBaseStyle,
  background: "#f8fafc",
  color: "#94a3b8",
  border: "1px dashed var(--border)",
  cursor: "not-allowed",
};

export default function AdminSectionNav() {
  return (
    <div className="card" style={{ padding: 10, borderRadius: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Bookings
        </NavLink>

        <NavLink
          to="/admin/drivers"
          style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Drivers
        </NavLink>

        <span style={disabledStyle} title="Fixed Routes page will be added next">
          Fixed Routes
        </span>
      </div>
    </div>
  );
}