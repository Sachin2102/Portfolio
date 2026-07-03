export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EEF6F1" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: 900, color: "#0B1A14" }}>404</h1>
        <p style={{ color: "#3E5A4E", marginTop: 8 }}>Page not found</p>
        <a href="/" style={{ display: "inline-block", marginTop: 24, padding: "10px 28px", borderRadius: 9999, background: "#0D9488", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}
