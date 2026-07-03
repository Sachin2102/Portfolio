import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

/* ── tokens ───────────────────────────────────────────── */
const MINT  = "#EEF6F1";
const ACCENT = "#15c39a";
const GREEN  = "#16A34A";
const LIME   = "#65A30D";

/* ── exact style helpers from spec ───────────────────── */
function clipStyle(open: boolean): React.CSSProperties {
  return {
    maxWidth:   open ? "700px" : "0px",
    opacity:    open ? 1 : 0,
    overflow:   "hidden",
    marginLeft: "-38px",
    zIndex:     1,
    flexShrink: 0,
    transition: `max-width .58s cubic-bezier(.5,0,.15,1), opacity .42s ease ${open ? ".08s" : "0s"}`,
  };
}

function logoStyle(open: boolean): React.CSSProperties {
  return {
    position:  "relative",
    zIndex:    3,
    flexShrink: 0,
    width:     "112px",
    height:    "112px",
    display:   "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor:    "pointer",
    transform: open ? "scale(1.06)" : "scale(1)",
    filter:    open
      ? "drop-shadow(0 14px 34px rgba(21,195,154,.55))"
      : "drop-shadow(0 8px 20px rgba(15,60,45,.22))",
    transition: "transform .4s ease, filter .4s ease",
  };
}

function rowStyle(open: boolean, i: number): React.CSSProperties {
  return {
    transform:  open ? "translateX(0)" : "translateX(26px)",
    opacity:    open ? 1 : 0,
    transition:
      `transform .5s cubic-bezier(.3,.9,.3,1) ${open ? 0.12 + i * 0.07 : 0}s, ` +
      `opacity .45s ease ${open ? 0.12 + i * 0.07 : 0}s`,
  };
}

/* ── reusable stat chip ───────────────────────────────── */
function Chip({ k, v }: { k: string; v: string }) {
  return (
    <div style={{
      background: "rgba(21,195,154,.10)",
      border: "1px solid rgba(21,195,154,.32)",
      borderRadius: 12, padding: "9px 14px", textAlign: "center",
    }}>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: "#34d8ad", lineHeight: 1.2 }}>{k}</div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5, color: "rgba(220,240,232,.55)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>{v}</div>
    </div>
  );
}

/* ── dark panel shell ─────────────────────────────────── */
function Panel({ children, watermark = "01" }: { children: React.ReactNode; watermark?: string }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#0a2419,#0e3325 60%,#0a2014)",
      borderRadius: 24, position: "relative", overflow: "hidden",
      padding: "26px 30px 26px 70px", width: 660,
    }}>
      {/* watermark */}
      <span style={{
        position: "absolute", top: 10, right: 20,
        fontSize: 128, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700,
        color: "rgba(21,195,154,.10)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>{watermark}</span>
      {children}
    </div>
  );
}

/* ── Grammarly Card ───────────────────────────────────── */
function GrammarlyCard() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "center", position: "relative", height: 240 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* logo */}
      <div style={logoStyle(open)}>
        <img src="/grammarly.png" width={108} height={108} style={{ objectFit: "contain", display: "block" }} alt="Grammarly" />
      </div>

      {/* clip window */}
      <div style={clipStyle(open)}>
        <Panel>
          {/* row 0 — eyebrow */}
          <div style={{ ...rowStyle(open, 0), marginBottom: 10 }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.62rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#34d8ad", margin: 0 }}>
              Freemium SaaS · Conversion Strategy
            </p>
          </div>
          {/* row 1 — headline */}
          <div style={{ ...rowStyle(open, 1), marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 30, textTransform: "uppercase", color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Why 30M Daily Users<br />Don't Pay
            </h3>
          </div>
          {/* row 2 — body */}
          <div style={{ ...rowStyle(open, 2), marginBottom: 18 }}>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 400, fontSize: "0.88rem", lineHeight: 1.65, color: "rgba(220,240,232,.78)", maxWidth: 520, margin: 0 }}>
              A product teardown of Grammarly's monetisation gap — where $0.70/user revenue meets a
              $12/month Pro plan. Three personas, a matrix against eight tools, and four product
              changes with metrics.
            </p>
          </div>
          {/* row 3 — chips + CTA */}
          <div style={{ ...rowStyle(open, 3), display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <Chip k="30M+" v="Daily Users" />
            <Chip k="$13B" v="Valuation" />
            <Chip k="~5%" v="Conversion" />
            <Link href="/case-study/grammarly" style={{ marginLeft: "auto" }}>
              <a style={{
                background: "linear-gradient(90deg,#15c39a,#0f9d7a)",
                color: "#04140d", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700,
                fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "12px 20px", borderRadius: 9999, whiteSpace: "nowrap",
                textDecoration: "none", display: "inline-block",
              }}>
                Read Case Study →
              </a>
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ── WhatsApp Card ────────────────────────────────────── */
function WhatsAppCard() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "center", position: "relative", height: 240 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* logo */}
      <div style={logoStyle(open)}>
        <img src="/whatsapp.png" width={108} height={108} style={{ objectFit: "contain", display: "block" }} alt="WhatsApp" />
      </div>

      {/* clip window */}
      <div style={clipStyle(open)}>
        <Panel watermark="02">
          <div style={{ ...rowStyle(open, 0), marginBottom: 10 }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.62rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#34d8ad", margin: 0 }}>
              B2B Platform · Monetisation Strategy
            </p>
          </div>

          <div style={{ ...rowStyle(open, 1), marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 30, textTransform: "uppercase", color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Coming Soon
            </h3>
          </div>

          <div style={{ ...rowStyle(open, 2), marginBottom: 18 }}>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 400, fontSize: "0.88rem", lineHeight: 1.65, color: "rgba(220,240,232,.78)", maxWidth: 520, margin: 0 }}>
              A deep-dive into WhatsApp's B2B growth and monetisation model — the Business API,
              platform strategy, and how 2B+ users translate into enterprise revenue.
            </p>
          </div>

          <div style={rowStyle(open, 3)}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 9999, background: "rgba(21,195,154,.10)", border: "1px solid rgba(21,195,154,.32)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d8ad" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.62rem", letterSpacing: ".16em", textTransform: "uppercase", color: "#34d8ad", fontWeight: 500 }}>In Progress</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────── */
export default function CaseStudiesStack() {
  return (
    <section
      id="work"
      style={{
        position: "relative", zIndex: 10,
        padding: "clamp(3rem,6vw,6rem) clamp(1.25rem,4vw,2.5rem) clamp(3rem,6vw,6rem)",
        background: MINT, borderRadius: "50px 50px 0 0", marginTop: -40,
      }}
    >
      <motion.h2
        style={{
          fontFamily: "'Kanit',sans-serif", fontWeight: 900, textTransform: "uppercase",
          fontSize: "clamp(3rem,12vw,11rem)", lineHeight: 1, textAlign: "center",
          marginBottom: "clamp(2.5rem,5vw,4rem)",
          background: `linear-gradient(135deg,${ACCENT} 0%,${GREEN} 50%,${LIME} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        Case Studies
      </motion.h2>

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 48 }}>
        <GrammarlyCard />
        <WhatsAppCard />
      </div>
    </section>
  );
}
