// export default function TopBar({ brand }) {
//   return (
//     <div style={{ background: "var(--blue-50)", borderBottom: "1px solid var(--border)" }}>
//       <div
//         className="container"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 10,
//           padding: "10px 0",
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
//           <a className="pill" href={`tel:${brand.phoneDial}`}>
//             📞 {brand.phoneDisplay}
//           </a>
//           <a className="pill" href={`mailto:${brand.email}`}>
//             ✉️ {brand.email}
//           </a>
//           <span className="pill">📍 {brand.addressShort}</span>
//         </div>
//
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           <a className="pill" href={brand.socials.facebook} aria-label="Facebook">f</a>
//           <a className="pill" href={brand.socials.instagram} aria-label="Instagram">ig</a>
//           <a className="pill" href={brand.socials.x} aria-label="X">x</a>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";

export default function TopBar({ brand, adminMode = false }) {
  const navigate = useNavigate();

  return (
    <div
      className="topBarRoot"
      style={{
        background: "var(--blue-50)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container topBarShell">
        {!adminMode && (
          <>
            <div className="topBarLeft topBarDesktopOnly">
              <a className="pill topBarPill" href={`tel:${brand.phoneDial}`}>
                📞 {brand.phoneDisplay}
              </a>
              <a className="pill topBarPill" href={`mailto:${brand.email}`}>
                ✉️ {brand.email}
              </a>
              <span className="pill topBarPill">📍 {brand.addressShort}</span>
            </div>

            <div className="topBarRight topBarDesktopOnly">
              <div className="topBarSocials">
                <a className="pill topBarPill" href={brand.socials.facebook} aria-label="Facebook">f</a>
                <a className="pill topBarPill" href={brand.socials.instagram} aria-label="Instagram">ig</a>
                <a className="pill topBarPill" href={brand.socials.x} aria-label="X">x</a>
              </div>
            </div>
          </>
        )}

        {adminMode && (
          <div className="topBarRight">
            <div className="topBarAdminLabel muted" style={{ fontSize: 12, fontWeight: 700 }}>
              Admin
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
