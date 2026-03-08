export default function Footer({ brand }) {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "28px 0", background: "#fff" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 900 }}>{brand.companyName}</div>
          <div className="muted" style={{ marginTop: 6, maxWidth: 420 }}>
            Reliable rides across Seattle, airport transfers, city trips, SUVs and vans for groups.
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 900 }}>Contact</div>
          <div className="muted" style={{ marginTop: 6 }}>
            <div><a href={`tel:${brand.phoneDial}`}>{brand.phoneDisplay}</a></div>
            <div><a href={`mailto:${brand.email}`}>{brand.email}</a></div>
            <div>{brand.addressShort}</div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 16, color: "var(--muted)", fontSize: 12 }}>
        © {new Date().getFullYear()} {brand.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
