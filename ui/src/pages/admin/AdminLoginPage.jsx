import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { setAdminSession } from "../../auth/adminAuth";

// 🔌 Replace this later with your real backend login call.
// For now, it’s a dev-only local login.
async function loginAdmin(username, password) {
  // Simple dev gate: change password here if you want
  if (username === "admin" && password === "admin123") {
    return {
      token: "dev-admin-token",
      adminName: "Admin",
      expiresAt: Date.now() + 1000 * 60 * 60 * 8, // 8 hours
    };
  }
  throw new Error("Invalid admin credentials.");
}

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const brand = useMemo(
    () => ({
      companyName: "Seattle Blue Cab",
      phoneDisplay: "(206) 555-0123",
      phoneDial: "+12065550123",
      email: "info@seattlebluecab.com",
      addressShort: "Seattle, WA",
      socials: { facebook: "#", instagram: "#", x: "#" },
    }),
    []
  );

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const session = await loginAdmin(username.trim(), password);
      setAdminSession(session);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <TopBar brand={brand} />
      <Navbar brand={brand} />

      <section className="section" style={{ background: "linear-gradient(180deg, var(--blue-50), #ffffff)" }}>
        <div className="container">
          <div className="kicker">Admin</div>
          <h1 className="h1" style={{ marginBottom: 6 }}>Sign in</h1>
          <div className="muted" style={{ lineHeight: 1.6 }}>
            Admin dashboard access is separate from customer booking.
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          {error && (
            <div className="card" style={{ padding: 12, border: "1px solid #fecaca", background: "#fff5f5", marginBottom: 12 }}>
              <div style={{ fontWeight: 800, color: "#b91c1c" }}>Error</div>
              <div style={{ color: "#7f1d1d", marginTop: 4 }}>{error}</div>
            </div>
          )}

          <form className="card" style={{ padding: 16 }} onSubmit={onSubmit}>
            <div style={{ fontWeight: 900 }}>Credentials</div>
            <div className="muted" style={{ marginTop: 6 }}>
              (Dev-only for now. We’ll wire real backend login next.)
            </div>

            <div className="grid grid2" style={{ gap: 12, marginTop: 12 }}>
              <div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 800 }}>Username</div>
                <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              <div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 800 }}>Password</div>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button className="btn btnGhost" type="button" onClick={() => navigate("/")}>
                Back
              </button>
              <button className="btn btnPrimary" type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  );
}