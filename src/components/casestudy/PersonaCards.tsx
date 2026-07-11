import React, { useState, useEffect } from "react";
import mayaFace from "./Maya_Chen.png";
import jamesFace from "./James_Okafor.png";
import priyaFace from "./Priya_Sharma.png";

/* ── palette (single two-tone system, no per-persona colors) ────── */
const SURFACE = "linear-gradient(135deg,#0a2419,#0e3325 60%,#0a2014)";
const MINT = "#34d8ad";
const ORB_GRAD = "linear-gradient(150deg,#15c39a,#0f9d7a)";
const INK = "#04140d";
const BODY = "rgba(220,240,232,.78)";
const SUB = "rgba(220,240,232,.55)";

const mint = (a: number) => `rgba(21,195,154,${a})`;

/* ── data ─────────────────────────────────────────────────────── */
export type Persona = {
  num: string; tag: string; name: string; initials: string;
  role: string; face?: string;
  quote: string;
  meta: [string, string][];
  tokens: string[];
  frustrations: string[];
  trigger: string;
};

export const PERSONAS: Persona[] = [
  {
    num: "01", tag: "P01 · STUDENT", name: "Maya Chen", initials: "MC",
    role: "Junior, Univ. of Michigan · Communications",
    face: mayaFace,
    quote: "\"I can't afford $12 a month, but I have a thesis due Friday and Grammarly keeps locking the suggestions I actually need.\"",
    meta: [["Age", "21 yrs"], ["Location", "Ann Arbor"], ["Income", "<$12K/yr"], ["Plan", "Free · 2yr"]],
    tokens: ["THESIS DUE FRI", "FREE · 2 YRS", "3 ESSAYS/WK"],
    frustrations: [
      "Paywall hits at 11 pm before a deadline, worst possible moment",
      "Can see a suggestion exists but can't read it, teasing without delivering",
      "$12/month is a real sacrifice with no monthly option",
    ],
    trigger: "High-stakes, deadline-moment paywall appears when anxiety is highest.",
  },
  {
    num: "02", tag: "P02 · PROFESSIONAL", name: "James Okafor", initials: "JO",
    role: "Senior Marketing Manager · B2B SaaS, Austin",
    face: jamesFace,
    quote: "\"I send 40 emails a day to enterprise clients. I can't afford to sound sloppy, but I also can't afford to re-read everything twice.\"",
    meta: [["Age", "34 yrs"], ["Location", "Austin, TX"], ["Income", "$95K/yr"], ["Plan", "Lapsed"]],
    tokens: ["40 EMAILS/DAY", "LAPSED PRO", "B2B SAAS"],
    frustrations: [
      "Weekly email shows vanity stats, nothing actionable",
      "Never shown a specific mistake that cost him no aha moment",
      "Can't justify $12/month to finance without a clear ROI story",
    ],
    trigger: "Seeing the specific missed suggestion from a document he actually wrote that week",
  },
  {
    num: "03", tag: "P03 · NON-NATIVE WRITER", name: "Priya Sharma", initials: "PS",
    role: "Data Analyst · Consulting Firm, New York",
    face: priyaFace,
    quote: "\"I re-read every email three times. I know my analysis is right; I just need to know my English is right too.\"",
    meta: [["Age", "28 yrs"], ["Native", "Hindi"], ["Tenure", "3 yrs free"], ["Plan", "Power"]],
    tokens: ["3 RE-READS", "POWER USER", "ESL WRITER"],
    frustrations: [
      "Free tier catches grammar but misses tone & naturalness",
      "No way to know if an email reads as confident or obviously non-native",
      "No memory of her writing style; every document starts from zero",
    ],
    trigger: "Personal Writing Voice Profile memory of her style no competitor can replicate",
  },
];

/* ── style helpers ────────────────────────────────────────────── */
function clipStyle(open: boolean, left: boolean): React.CSSProperties {
  return {
    maxWidth: open ? 760 : 0,
    opacity: open ? 1 : 0,
    overflow: "hidden",
    marginLeft: left ? -42 : 0,
    marginRight: left ? 0 : -42,
    zIndex: 1,
    flexShrink: 0,
    transition: `max-width .6s cubic-bezier(.5,0,.15,1), opacity .42s ease ${open ? ".08s" : "0s"}`,
  };
}

function rowStyle(open: boolean, i: number, left: boolean): React.CSSProperties {
  return {
    transform: open ? "translateX(0)" : `translateX(${left ? "24px" : "-24px"})`,
    opacity: open ? 1 : 0,
    transition: `transform .5s cubic-bezier(.3,.9,.3,1) ${open ? 0.12 + i * 0.08 : 0}s, opacity .45s ease ${open ? 0.12 + i * 0.08 : 0}s`,
  };
}

/* ── avatar orb scene ─────────────────────────────────────────── */
function AvatarOrb({ p, left }: { p: Persona; left: boolean }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div style={{ position: "relative", flex: 1, minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* orbit ring */}
      <div style={{
        position: "absolute", width: 210, height: 210, borderRadius: "50%",
        border: `1px dashed ${mint(0.3)}`, borderTopColor: mint(0.6),
        animation: "pc-spin 14s linear infinite", pointerEvents: "none",
      }} />

      {/* orb */}
      <div style={{
        position: "relative", width: 168, height: 168, borderRadius: "50%", overflow: "hidden",
        background: ORB_GRAD,
        boxShadow: "0 26px 44px rgba(4,20,13,.55), 0 0 0 2px rgba(21,195,154,.40)",
        animation: "pc-floaty 4.5s ease-in-out infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {p.face && imgOk ? (
          <img src={p.face} alt={p.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgOk(false)} />
        ) : (
          <span style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: "2.2rem", color: INK }}>{p.initials}</span>
        )}
        {/* gloss overlay */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none",
          boxShadow: "inset -10px -12px 26px rgba(0,0,0,.40), inset 8px 10px 20px rgba(190,255,238,.32)",
        }} />
        {/* specular highlight */}
        <div style={{
          position: "absolute", top: 20, left: 26, width: 42, height: 28, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,.55), transparent 70%)",
          filter: "blur(2px)", pointerEvents: "none",
        }} />
      </div>

      {/* floating tokens */}
      {p.tokens.map((t, i) => {
        const positions = left
          ? [{ top: -6, right: -20 }, { top: "44%", left: -38 }, { bottom: -6, right: 0 }]
          : [{ top: -6, left: -20 }, { top: "44%", right: -38 }, { bottom: -6, left: 0 }];
        return (
          <span key={t} style={{
            position: "absolute", ...positions[i],
            fontFamily: "'Times New Roman', Times, serif", fontSize: "0.66rem", letterSpacing: "0.05em",
            color: MINT, background: mint(0.12), border: `1px solid ${mint(0.34)}`,
            borderRadius: 8, padding: "4px 9px", whiteSpace: "nowrap", pointerEvents: "none",
            animation: `pc-floaty-tok ${4 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
          }}>{t}</span>
        );
      })}
    </div>
  );
}

/* ── name card (always visible) ───────────────────────────────── */
function NameCard({ p, open, left, setHover }: { p: Persona; open: boolean; left: boolean; setHover: () => void }) {
  return (
    <div
      onMouseEnter={setHover}
      style={{
        position: "relative", zIndex: 3, flexShrink: 0, width: 300,
        display: "flex", flexDirection: "column",
        background: SURFACE, borderRadius: 24,
        padding: "26px 26px 20px",
        overflow: "visible", cursor: "pointer",
        border: `1px solid ${mint(open ? 0.55 : 0.24)}`,
        boxShadow: open ? `0 30px 70px ${mint(0.55)}` : `0 18px 44px rgba(15,60,45,.22)`,
        transform: open ? "scale(1.02)" : "scale(1)",
        transition: "box-shadow .4s ease, border-color .4s ease, transform .4s ease",
      }}
    >
      {/* hairline accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        borderRadius: "24px 24px 0 0",
        background: left
          ? `linear-gradient(90deg, transparent, ${MINT})`
          : `linear-gradient(90deg, ${MINT}, transparent)`,
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 62, height: 62, borderRadius: "50%", flexShrink: 0,
          background: ORB_GRAD, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: "1.05rem", color: INK }}>{p.initials}</span>
        </div>
        <div>
          <p style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: "1.35rem", color: "#fff", lineHeight: 1.15, marginBottom: 3 }}>{p.name}</p>
          <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.82rem", color: MINT }}>{p.role}</p>
        </div>
      </div>

      <AvatarOrb p={p} left={left} />

      <p style={{
        marginTop: 14, fontFamily: "'Times New Roman', Times, serif", fontSize: "0.75rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: open ? MINT : SUB,
        alignSelf: left ? "flex-start" : "flex-end",
        transition: "color .3s ease",
      }}>
        {open ? "REVEALING" : "HOVER TO OPEN"}{left ? " ▸" : " ◂"}
      </p>
    </div>
  );
}

/* ── detail dossier panel ─────────────────────────────────────── */
function DetailPanel({ p, open, left }: { p: Persona; open: boolean; left: boolean }) {
  return (
    <div style={clipStyle(open, left)}>
      <div style={{
        position: "relative", width: 700, background: SURFACE,
        borderRadius: left ? "0 24px 24px 0" : "24px 0 0 24px",
        padding: left ? "26px 34px 26px 68px" : "26px 68px 26px 34px",
        borderTop: `1px solid ${mint(0.22)}`, borderBottom: `1px solid ${mint(0.22)}`,
        [left ? "borderRight" : "borderLeft"]: `1px solid ${mint(0.22)}`,
        overflow: "hidden",
      } as React.CSSProperties}>
        {/* watermark number */}
        <span style={{
          position: "absolute", top: -20, [left ? "left" : "right"]: -6,
          fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: 170,
          color: mint(0.1), lineHeight: 1, userSelect: "none", pointerEvents: "none",
        } as React.CSSProperties}>{p.num}</span>

        <div style={{ position: "relative" }}>
          {/* r0 — eyebrow */}
          <div style={{ ...rowStyle(open, 0, left), marginBottom: 14 }}>
            <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: MINT }}>{p.tag}</p>
          </div>

          {/* r1 — quote */}
          <div style={{ ...rowStyle(open, 1, left), marginBottom: 18 }}>
            <p style={{
              fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic", fontSize: "1.15rem",
              color: "#fff", lineHeight: 1.55,
              borderLeft: `3px solid ${MINT}`, paddingLeft: 15,
            }}>{p.quote}</p>
          </div>

          {/* r2 — meta grid */}
          <div style={{ ...rowStyle(open, 2, left), display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 }}>
            {p.meta.map(([k, v]) => (
              <div key={k} style={{ background: mint(0.10), border: `1px solid ${mint(0.32)}`, borderRadius: 11, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: SUB, marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: "0.95rem", color: MINT }}>{v}</div>
              </div>
            ))}
          </div>

          {/* r3 — frustrations + trigger */}
          <div style={rowStyle(open, 3, left)}>
            <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: SUB, marginBottom: 10 }}>Frustrations</p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {p.frustrations.map((f, j) => (
                <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <span style={{ color: MINT, fontSize: "0.95rem", lineHeight: 1.5, flexShrink: 0 }}>✕</span>
                  <span style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.95rem", color: BODY, lineHeight: 1.5 }}>{f}</span>
                </li>
              ))}
            </ul>

            <div style={{ background: mint(0.10), border: `1px solid ${mint(0.32)}`, borderRadius: 12, padding: "12px 16px" }}>
              <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: MINT, marginBottom: 6 }}>◎ Conversion Trigger</p>
              <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.95rem", color: "#fff", lineHeight: 1.5 }}>{p.trigger}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── compact mode: below this width, NameCard(300) + Panel(700) never
     fit side-by-side, and the reveal relies on hover which doesn't exist
     on touch — so instead of a broken drawer, render everything stacked
     and always visible ──────────────────────────────────────────── */
function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

function CompactPersonaCard({ p }: { p: Persona }) {
  return (
    <div style={{
      background: SURFACE, borderRadius: 24, border: `1px solid ${mint(0.24)}`,
      padding: "24px 20px", boxShadow: `0 18px 44px rgba(15,60,45,.22)`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
          background: ORB_GRAD, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 0 2px ${mint(0.4)}`,
        }}>
          {p.face ? (
            <img src={p.face} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: "1rem", color: INK }}>{p.initials}</span>
          )}
        </div>
        <div>
          <p style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", lineHeight: 1.15 }}>{p.name}</p>
          <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.78rem", color: MINT, marginTop: 2 }}>{p.role}</p>
        </div>
      </div>

      <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: MINT, marginBottom: 10 }}>{p.tag}</p>

      <p style={{
        fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic", fontSize: "1.02rem",
        color: "#fff", lineHeight: 1.5, borderLeft: `3px solid ${MINT}`, paddingLeft: 13, marginBottom: 16,
      }}>{p.quote}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 18 }}>
        {p.meta.map(([k, v]) => (
          <div key={k} style={{ background: mint(0.10), border: `1px solid ${mint(0.32)}`, borderRadius: 11, padding: "9px 6px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: SUB, marginBottom: 3 }}>{k}</div>
            <div style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700, fontSize: "0.9rem", color: MINT }}>{v}</div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: SUB, marginBottom: 9 }}>Frustrations</p>
      <ul style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
        {p.frustrations.map((f, j) => (
          <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ color: MINT, fontSize: "0.9rem", lineHeight: 1.5, flexShrink: 0 }}>✕</span>
            <span style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.9rem", color: BODY, lineHeight: 1.5 }}>{f}</span>
          </li>
        ))}
      </ul>

      <div style={{ background: mint(0.10), border: `1px solid ${mint(0.32)}`, borderRadius: 12, padding: "11px 14px" }}>
        <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MINT, marginBottom: 5 }}>◎ Conversion Trigger</p>
        <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.9rem", color: "#fff", lineHeight: 1.5 }}>{p.trigger}</p>
      </div>
    </div>
  );
}

/* ── one persona row ──────────────────────────────────────────── */
function PersonaRow({ p, index, open, onEnter, onLeave }: { p: Persona; index: number; open: boolean; onEnter: () => void; onLeave: () => void }) {
  const left = index % 2 === 1;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "flex", alignItems: "stretch", minHeight: 200,
        flexDirection: left ? "row-reverse" : "row",
        justifyContent: "flex-end",
      }}
    >
      <DetailPanel p={p} open={open} left={left} />
      <NameCard p={p} open={open} left={left} setHover={onEnter} />
    </div>
  );
}

/* ── root ──────────────────────────────────────────────────────── */
export default function PersonaCards({ personas = PERSONAS }: { personas?: Persona[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const compact = useIsCompact();

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: compact ? 20 : 28 }}>
      <style>{`
        @keyframes pc-spin { to { transform: rotate(360deg); } }
        @keyframes pc-floaty { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-9px);} }
        @keyframes pc-floaty-tok { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(6px);} }
      `}</style>
      {compact
        ? personas.map((p) => <CompactPersonaCard key={p.num} p={p} />)
        : personas.map((p, i) => (
            <PersonaRow
              key={p.num}
              p={p}
              index={i}
              open={hover === i}
              onEnter={() => setHover(i)}
              onLeave={() => setHover(null)}
            />
          ))}
    </div>
  );
}
