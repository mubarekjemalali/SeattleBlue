// export default function Hero({ brand, onBookNow }) {
//   return (
//     <section
//       className="section"
//       style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff)" }}
//     >
//       <div className="container grid grid2" style={{ alignItems: "center" }}>
//         <div>
//           <div className="kicker">Safe • Reliable • On time</div>
//           <h1 className="h1">
//             Ride with confidence in{" "}
//             <span style={{ color: "var(--blue-900)" }}>Seattle</span>.
//           </h1>
//           <div className="muted" style={{ fontSize: 16, lineHeight: 1.6 }}>
//             Airport transfers, city rides, SUVs and vans. Simple booking, clear
//             communication, and professional drivers.
//           </div>
//
//           <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
//             <button className="btn btnPrimary" onClick={onBookNow}>
//               Book Now
//             </button>
//             <a className="btn btnGhost" href={`tel:${brand.phoneDial}`}>
//               Call {brand.phoneDisplay}
//             </a>
//           </div>
//
//           <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
//             <span className="pill">✅ Flat-rate routes</span>
//             <span className="pill">✅ SUVs & Vans</span>
//             <span className="pill">✅ 24/7 booking</span>
//           </div>
//         </div>
//
//         {/*
//           HERO IMAGE:
//           - Put your hero photo here:
//               UI/public/side_shot.png
//           - Later you can replace it with a better photo (same file name).
//         */}
//         <div className="card" style={{ padding: 1 }}>
//           <img
//             src="/side_shot1.png"
//             alt="Blue Cab taxi"
//             style={{
//               width: "100%",
//               height: 260,
//               objectFit: "cover",   // keeps the image looking good without distortion
// //               objectFit: "contain",   // keeps the image looking good without distortion
//
//               borderRadius: 1,
//               display: "block",
//             }}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
import { useNavigate } from "react-router-dom";

export default function Hero({ brand, onBookNow }) {
  const navigate = useNavigate();

  return (
    <section
      className="section"
      style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff), padding: 15" }}
    >
      <div className="container grid grid2" style={{ alignItems: "center" }}>
        <div>
          <div className="kicker">Safe • Reliable • On time</div>
          <h1 className="h1">
            The real{" "}
            <span style={{ color: "var(--blue-900)" }}>Seattle Blue Cab</span>.
          </h1>

          <div className="muted" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Trusted local rides, airport transfers, SUVs, and vans with clear
            communication, professional service, and the official Blue Cab booking experience.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <span className="pill">✅ Flat-rate routes</span>
            <span className="pill">✅ SUVs & Vans</span>
            <span className="pill">✅ 24/7 booking</span>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18, marginBottom: 18, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" onClick={onBookNow}>
              Book Now
            </button>

            <button
              type="button"
              className="btn btnGhost"
              onClick={() => navigate("/about")}
            >
              About Us
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 1 }}>
          <img
            src="/side_shot1.png"
            alt="Blue Cab taxi"
            style={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              borderRadius: 1,
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}