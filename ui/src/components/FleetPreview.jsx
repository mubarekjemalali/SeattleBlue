export default function FleetPreview({ onBookNow }) {

     /*
        FLEET IMAGES (VERY EASY TO REPLACE LATER)
        ----------------------------------------
        We load fleet images from /public so there are NO imports required.

        Put these files here:
          UI/public/fleet_sedan.png
          UI/public/fleet_suv.png
          UI/public/fleet_van.png

        Later, when you get real vehicle photos, simply replace those files
        with new images using the SAME file names. No code changes needed.
      */
      const vehicles = [
        {
          title: "Sedan",
          subtitle: "Comfort ride",
          seats: 4,
          luggage: 2,
          imageSrc: "/sedan.jpg", // UI/public/fleet_sedan.png
        },
        {
          title: "SUV",
          subtitle: "More space",
          seats: 6,
          luggage: 4,
          imageSrc: "/big_van_white_blue.jpg", // UI/public/fleet_suv.png
        },
        {
          title: "Van",
          subtitle: "Groups & airport",
          seats: 10,
          luggage: 8,
          imageSrc: "/big_van_blue.jpg", // UI/public/fleet
          }
      ]

  return (
    <section className="section" style={{ background: "var(--blue-50)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="kicker">Fleet</div>
            <div className="h2">Vehicle options for every trip</div>
            <div className="muted" style={{ fontSize: 14 }}>
              Sedans, SUVs, and vans — choose what fits your group.
            </div>
          </div>
          <button className="btn btnGhost" onClick={onBookNow}>
            Book a ride
          </button>
        </div>

        <div className="grid grid3" style={{ marginTop: 16 }}>
          {vehicles.map((v) => (
            <div key={v.title} className="card" style={{ padding: 14 }}>
              <img
                src={v.imageSrc}
                alt={`${v.title} vehicle`}
                style={{
                  width: "100%",
                  height: 140,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  objectFit: "cover",
                  display: "block",
                  background: "#fff",
                }}
              />

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 18 }}>{v.title}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {v.subtitle}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <span className="pill">👤 {v.seats} passengers</span>
                <span className="pill">🧳 {v.luggage} luggage</span>
              </div>

              <div style={{ marginTop: 12 }}>
                <button className="btn btnPrimary" onClick={onBookNow} style={{ width: "100%" }}>
                  Book {v.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
