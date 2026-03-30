// export default function Navbar({ brand, onBookNow }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderBottom: "1px solid var(--border)",
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//       }}
//     >
//       <div
//         className="container"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 12,
//           padding: "14px 0",
//         }}
//       >
//         {/*
//           LOGO:
//           - We are loading the logo from /public so we don’t have to deal with imports.
//           - Put your logo file here:
//               UI/public/blue_for_hire_clean_transparent.png
//           - Later when you get a true vector logo (SVG), just replace the file with the same name.
//         */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <img
//             src="/blue_for_hire_clean_transparent.png"
//             alt={`${brand.companyName} Logo`}
//             style={{
//               height: 38,      // adjust if you want the logo bigger/smaller
//               width: "auto",
//               display: "block",
//             }}
//           />
//
//           <div style={{ lineHeight: 1.1 }}>
//             <div style={{ fontWeight: 900 }}>{brand.companyName}</div>
//             <div className="muted" style={{ fontSize: 12 }}>
//               Taxi • Airport • Vans
//             </div>
//           </div>
//         </div>
//
//         {/* Desktop links (keep minimal for now) */}
//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           <button className="btn btnGhost" onClick={onBookNow}>
//             Book Now
//           </button>
//           <a className="btn btnPrimary" href={`tel:${brand.phoneDial}`}>
//             Need help? Call
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ brand, onBookNow, adminMode = false }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 0",
        }}
      >
        <Link to={adminMode ? "/admin/dashboard" : "/"} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/blue_for_hire_clean_transparent.png"
            alt={`${brand.companyName} Logo`}
            style={{ height: 38, width: "auto", display: "block" }}
          />

          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900 }}>{brand.companyName}</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {adminMode ? "Admin Portal" : "Taxi • Airport • Vans"}
            </div>
          </div>
        </Link>

        {!adminMode && (
          <div
            className="publicNavbarActions hideOnSmallScreen"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <button className="btn btnGhost" onClick={() => navigate("/booking")}>
              <span className="desktopOnlyLabel">Book Now</span>
              <span className="mobileOnlyLabel">Book</span>
            </button>
            <button className="btn btnGhost" onClick={() => navigate("/contact")}>
              <span className="desktopOnlyLabel">Contact Us</span>
              <span className="mobileOnlyLabel">Contact</span>
            </button>

            <a className="btn btnPrimary" href={`tel:${brand.phoneDial}`}>
              <span className="desktopOnlyLabel">Need help? Call</span>
              <span className="mobileOnlyLabel">Call</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}