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

export default function Navbar({ brand, onBookNow }) {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 0" }}>
        {/*
          LOGO:
          Put your cleaned logo in:
            UI/public/blue_for_hire_clean_transparent.png
          Later you can replace that file without changing code.
        */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/blue_for_hire_clean_transparent.png"
            alt={`${brand.companyName} Logo`}
            style={{ height: 38, width: "auto", display: "block" }}
          />

          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900 }}>{brand.companyName}</div>
            <div className="muted" style={{ fontSize: 12 }}>Taxi • Airport • Vans</div>
          </div>
        </Link>

        {/* Simple links (minimal for now) */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Keep this for now if you still want scroll-to-booking on homepage sections */}
          {/* On booking page, we go directly to /booking */}
          <button className="btn btnGhost" onClick={() => navigate("/booking")}>
            Book Now
          </button>

          <a className="btn btnPrimary" href={`tel:${brand.phoneDial}`}>
            Need help? Call
          </a>
        </div>
      </div>
    </div>
  );
}
