import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingTeaser() {
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const handleContinue = () => {
    const p = encodeURIComponent(pickup.trim());
    const d = encodeURIComponent(dropoff.trim());
    navigate(`/booking?pickup=${p}&dropoff=${d}`);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div className="kicker">Quick Booking</div>
              <div className="h2">Tell us where you’re going</div>
              <div className="muted" style={{ fontSize: 14 }}>
                Tell us where you want to go.
              </div>
            </div>

            <button className="btn btnPrimary" onClick={handleContinue}>
              Continue
            </button>
          </div>

          <div className="grid grid2" style={{ marginTop: 14 }}>
            <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 12 }}>
              <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Pickup</div>
              <input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter pickup location"
                style={{ width: "100%", border: 0, outline: "none", fontSize: 16 }}
              />
            </div>

            <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 12 }}>
              <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Dropoff</div>
              <input
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Enter dropoff location"
                style={{ width: "100%", border: 0, outline: "none", fontSize: 16 }}
              />
            </div>
          </div>

          <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
{/*             Note: Autocomplete + map preview will be added in the booking workflow. */}
          </div>
        </div>
      </div>
    </section>
  );
}
