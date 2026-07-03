import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────────────── */

const experienceCards = [
  {
    num: "01", abbr: "CA",
    name: "CyberAlliance",
    logo: "/logos/cyberalliance.png",
    role: "Cyber Security Product Manager",
    badge: "Current", dates: "Jun 2026 – Present", location: "Remote",
    color: "#0D9488",
    tags: ["Security PM", "AI Tooling", "Threat Intel", "Roadmap"],
    points: [
      "Driving security product roadmap with AI-powered PM tooling",
      "Enterprise threat intelligence product strategy",
    ],
    bars: [
      { label: "Roadmap coverage", val: "100%", pct: 100 },
      { label: "AI features shipped", val: "3+",   pct: 75  },
      { label: "Stakeholder alignment", val: "↑",  pct: 88  },
    ],
  },
  {
    num: "02", abbr: "Q",
    name: "Qualys",
    logo: "/logos/qualys.png",
    role: "QA Engineer",
    badge: "Full-time", dates: "Apr 2024 – Jul 2025", location: "Pune, India · Hybrid",
    color: "#dc2626",
    tags: ["VMDR", "API Design", "Python / Perl"],
    points: [
      "22% reduction in false positives across 35+ enterprise accounts",
      "30% faster patch remediation via RICE-prioritized backlog",
      "40% cut in release validation via custom automation analytics",
    ],
    bars: [
      { label: "False positives reduced", val: "22%", pct: 55  },
      { label: "Patch speed improvement", val: "30%", pct: 75  },
      { label: "Release validation saved", val: "40%", pct: 100 },
    ],
  },
  {
    num: "03", abbr: "SS",
    name: "ShellStrong Technologies",
    logo: "/logos/shellstrong.png",
    logoBg: "#0B2A24",
    role: "Digital Forensic Intern",
    badge: "Internship", dates: "Jul 2023 – Dec 2023", location: "Pune, India · On-site",
    color: "#059669",
    tags: ["DFIR", "AXIOM", "Cellebrite", "UFED"],
    points: [
      "60+ live forensic cases alongside government agencies",
      "95% stakeholder confidence across law enforcement investigations",
      "~20% investigation rework reduction via standardized workflows",
    ],
    bars: [
      { label: "Live cases handled",      val: "60+", pct: 100 },
      { label: "Stakeholder confidence",  val: "95%", pct: 95  },
      { label: "Rework reduction",        val: "20%", pct: 50  },
    ],
  },
  {
    num: "04", abbr: "CS",
    name: "Cyber Security Corp",
    logo: null,
    role: "Digital Forensic Intern",
    badge: "Internship", dates: "Aug 2022 – Oct 2022", location: "Pune, India · On-site",
    color: "#ea580c",
    tags: ["Autopsy", "FTK", "Chain of Custody", "Reporting"],
    points: [
      "15+ cybercrime investigations — email, mobile, storage media",
      "Chain-of-custody documentation with Autopsy & FTK",
      "Forensic reports crafted for non-technical stakeholders",
    ],
    bars: [
      { label: "Investigations completed", val: "15+", pct: 75  },
      { label: "Evidence types covered",   val: "3",   pct: 60  },
      { label: "Reports delivered",        val: "15+", pct: 75  },
    ],
  },
  {
    num: "05", abbr: "PM",
    name: "Pune Metro Rail Project",
    logo: "/logos/pune-metro.png",
    role: "Security Intern",
    badge: "Internship", dates: "Jun 2022 – Aug 2022", location: "Pune, India · On-site",
    color: "#7c3aed",
    tags: ["Security Audit", "Infrastructure", "Big Data", "Documentation"],
    points: [
      "10,000+ passenger records analyzed — identified process gaps",
      "Security baseline documentation adopted by operations team",
      "Big data infrastructure and security protocol analysis",
    ],
    bars: [
      { label: "Records analyzed",   val: "10K+", pct: 100 },
      { label: "Gaps identified",    val: "8+",   pct: 80  },
      { label: "Docs adopted",       val: "100%", pct: 100 },
    ],
  },
];

const certCards = [
  { num: "01", abbr: "SA",  name: "Certified Scrum Product Owner", role: "CSPO · Scrum Alliance", color: "#E85D26", tags: ["May 2026", "ID 001791116", "PM"], points: ["Agile product ownership and backlog prioritization", "Sprint planning across cross-functional teams", "Stakeholder communication and release planning"], bars: [{ label: "Completion", val: "100%", pct: 100 }] },
  { num: "02", abbr: "SA",  name: "Certified ScrumMaster",         role: "CSM · Scrum Alliance",  color: "#F0A500", tags: ["Oct 2025", "ID 001791116", "PM"], points: ["Facilitate Scrum ceremonies and remove blockers", "Coach teams toward continuous delivery", "Agile metrics and retrospective facilitation"], bars: [{ label: "Completion", val: "100%", pct: 100 }] },
  { num: "03", abbr: "IBM", name: "Enterprise Design Thinking",     role: "Practitioner · IBM",    color: "#0F62FE", tags: ["May 2026", "PM"], points: ["User-centred product design at enterprise scale", "Empathy mapping and rapid prototyping", "Hill statement and playback facilitation"], bars: [{ label: "Completion", val: "100%", pct: 100 }] },
  { num: "04", abbr: "EC",  name: "Ethical Hacking Essentials",     role: "EHE · EC-Council",      color: "#B91C1C", tags: ["Mar 2024", "ID 305947", "Security"], points: ["Network scanning and vulnerability identification", "Exploitation and post-exploitation methodology", "Ethical hacking tools and reporting"], bars: [{ label: "Completion", val: "100%", pct: 100 }] },
  { num: "05", abbr: "EC",  name: "Digital Forensics Essentials",   role: "DFE · EC-Council",      color: "#B91C1C", tags: ["Nov 2023", "ID 266372", "Security"], points: ["Digital evidence acquisition and preservation", "File-system forensics and timeline analysis", "Chain-of-custody and legal documentation"], bars: [{ label: "Completion", val: "100%", pct: 100 }] },
  { num: "06", abbr: "THM", name: "CompTIA PenTest+ Path",          role: "TryHackMe",             color: "#212C42", tags: ["Aug 2021", "THM-NO1OGPXQ3P", "Security"], points: ["Recon, scanning, exploitation, and reporting", "Structured PenTest+ learning path completion", "Hands-on CTF labs and real-world scenarios"], bars: [{ label: "Completion", val: "100%", pct: 100 }] },
];

const eduCards = [
  {
    num: "01", abbr: "NC",
    name: "NC State University",
    logo: "/logo-ncstate.png",
    role: "Master of Engineering Management (MEM)",
    badge: "In Progress", dates: "Aug 2025 – May 2027", location: "Raleigh, NC",
    color: "#CC0000",
    skills: ["Product Management", "Product-Led Growth", "Product Ideation", "Leadership", "Problem Solving", "Critical Thinking"],
    points: [
      "Engineering / Industrial Management focus",
      "Bridges forensic depth with product leadership at scale",
      "Full-time on-campus at Raleigh, NC",
    ],
    bars: [
      { label: "Program progress", val: "~50%", pct: 50 },
      { label: "Credits completed", val: "18+",  pct: 60 },
    ],
  },
  {
    num: "02", abbr: "SS",
    name: "Symbiosis Skills & Professional University",
    logo: "/logo-sspu.png",
    role: "BTech — Computer Science & Cyber Security",
    badge: "Graduated", dates: "Aug 2020 – Jul 2024", location: "Pune, India",
    color: "#C0392B",
    skills: ["Cybersecurity", "Networking", "Python (Programming Language)", "Malware Analysis", "Regulatory Compliance", "Cryptography", "Software Development Life Cycle (SDLC)"],
    points: [
      "8.9 CGPA — top of graduating cohort",
      "Specialisation: Cyber Security & Digital Forensics",
      "Thesis: network intrusion detection with ML classifiers",
    ],
    bars: [
      { label: "CGPA",              val: "8.9 / 10", pct: 89 },
      { label: "Specialisation",    val: "Cyber",     pct: 100 },
    ],
  },
];

type Card = typeof experienceCards[number];
type Tab  = "Experience" | "Certifications" | "Education";

/* ─── Sticky Header ─────────────────────────────────────────────── */

function StickyHeader({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Tab[] = ["Experience", "Certifications", "Education"];
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "linear-gradient(to bottom, #EEF6F1 82%, transparent)",
      paddingTop: 12, paddingBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 4, padding: "5px 6px", background: "rgba(11,26,20,0.06)", borderRadius: 14 }}>
          {tabs.map((t) => {
            const active = t === tab;
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "9px 24px", borderRadius: 10,
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.75rem", letterSpacing: "0.05em",
                fontWeight: active ? 700 : 500,
                border: "none", cursor: "pointer",
                background: active ? "#FFFFFF" : "transparent",
                color: active ? "#0B1A14" : "rgba(11,26,20,0.45)",
                boxShadow: active ? "0 1px 6px rgba(11,26,20,0.10), 0 0 0 1px rgba(11,26,20,0.06)" : "none",
                transition: "all 0.2s", position: "relative",
              }}>
                {active && (
                  <span style={{
                    position: "absolute", bottom: 5, left: "50%",
                    transform: "translateX(-50%)",
                    width: 20, height: 2, borderRadius: 9999,
                    background: "linear-gradient(90deg, #0D9488, #16A34A)", display: "block",
                  }} />
                )}
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Card cosmetics ────────────────────────────────────────────── */

const CARD_BG = ["#FFFFFF", "#FAFFFE", "#F7FDFB", "#F4FBF8", "#F1FAF5", "#EEFAF3"];
const CARD_SHADOWS = [
  "0 2px 16px rgba(11,42,36,0.06)",
  "0 4px 28px rgba(11,42,36,0.09)",
  "0 8px 40px rgba(11,42,36,0.12)",
  "0 12px 52px rgba(11,42,36,0.15)",
  "0 18px 64px rgba(11,42,36,0.18)",
  "0 24px 80px rgba(11,42,36,0.22)",
];

const STICKY_BASE  = 96;
const STICKY_STEP  = 22;
const TARGET_SCALE = 0.92;

/* ─── Single card ───────────────────────────────────────────────── */

function StackCard({ item, index, interactive = true }: { item: Card; index: number; interactive?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const accent = item.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
      style={{
        borderRadius: 32,
        minHeight: 220,
        display: "flex", alignItems: "center",
        background: CARD_BG[index % CARD_BG.length],
        boxShadow: CARD_SHADOWS[index % CARD_SHADOWS.length],
        border: "1px solid rgba(11,42,36,0.05)",
        position: "relative",
        overflow: "hidden",
        cursor: interactive ? "pointer" : "default",
      }}
    >
      {/* ── Default face — stays in flow to set card height ── */}
      <motion.div
        animate={hovered ? { x: "-18%", opacity: 0, scale: 0.96 } : { x: "0%", opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0, 0.18, 1] }}
        style={{
          width: "100%",
          padding: "clamp(20px, 3vw, 36px) clamp(20px, 3vw, 40px)",
          display: "flex", alignItems: "center",
          gap: "clamp(20px, 2.8vw, 36px)", pointerEvents: "none",
          visibility: hovered ? "hidden" : "visible",
        }}
      >
        {/* Rotated index */}
        <span style={{
          position: "absolute", left: 14, top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          fontFamily: "'Space Mono', monospace", fontSize: "0.52rem",
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: `${accent}45`, userSelect: "none", whiteSpace: "nowrap",
        }}>{item.num}</span>

        {/* Logo tile */}
        <div style={{
          width: "clamp(96px, 9vw, 128px)", height: "clamp(96px, 9vw, 128px)",
          flexShrink: 0, borderRadius: 22,
          border: `1.5px solid ${accent}22`,
          background: (item as any).logoBg || (item.logo ? "#fff" : `${accent}10`),
          boxShadow: item.logo ? "0 6px 18px rgba(11,42,36,0.12)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginLeft: "clamp(12px, 1.5vw, 20px)", overflow: "hidden",
          padding: item.logo ? 8 : 0,
        }}>
          {item.logo ? (
            <img src={item.logo} alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 900, fontSize: "clamp(1.1rem, 2vw, 1.5rem)", color: accent, letterSpacing: "-0.02em" }}>{item.abbr}</span>
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: (item as any).badge === "Current" ? "#0D9488" : "#5A7A6E",
              border: `1px solid ${(item as any).badge === "Current" ? "#0D9488" : "#5A7A6E"}40`,
              padding: "3px 10px", borderRadius: 99,
            }}>{(item as any).badge}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#8AABA0", letterSpacing: "0.04em" }}>{(item as any).dates}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#8AABA0" }}>{(item as any).location}</span>
          </div>

          <h3 style={{
            fontFamily: "'Kanit', sans-serif", fontWeight: 900,
            fontSize: "clamp(1.25rem, 2.6vw, 1.9rem)", color: "#0B2A24",
            lineHeight: 1.05, marginBottom: 6,
            textTransform: "uppercase", letterSpacing: "-0.01em",
          }}>{item.name}</h3>

          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: "clamp(0.56rem, 0.9vw, 0.65rem)",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: accent, marginBottom: 14, fontWeight: 700,
          }}>{item.role}</p>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {item.tags?.map((t) => (
              <span key={t} style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.52rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                border: `1px solid ${accent}30`, color: accent,
                padding: "3px 9px", borderRadius: 99, background: `${accent}08`,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Ambient glow */}
        <div style={{
          position: "absolute", bottom: -50, right: -50,
          width: 240, height: 240, borderRadius: "50%", pointerEvents: "none",
          background: `radial-gradient(circle, ${accent}14 0%, transparent 68%)`,
        }} />
      </motion.div>

      {/* ── Hover panel ── */}
      <motion.div
        animate={hovered ? { x: "0%", opacity: 1 } : { x: "100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0, 0.18, 1] }}
        style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, #0a2419 0%, #0e3325 60%, #0a2014 100%)`,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "22px clamp(20px, 3vw, 40px) 22px clamp(28px, 3.5vw, 48px)",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        {/* Badge row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 13, flexShrink: 0,
            border: `1.5px solid ${accent}40`,
            background: (item as any).logoBg || (item.logo ? "rgba(255,255,255,0.08)" : `${accent}18`),
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", padding: item.logo ? 6 : 0,
          }}>
            {item.logo ? (
              <img src={item.logo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(1.1)" }} />
            ) : (
              <span style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 900, fontSize: "1rem", color: accent }}>{item.abbr}</span>
            )}
          </div>
          <div>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: accent, marginBottom: 3 }}>{item.role}</p>
            <p style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "rgba(224,242,236,0.95)", lineHeight: 1.1 }}>{item.name}</p>
          </div>
        </div>

        {/* Points list */}
        <motion.div
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.4, delay: hovered ? 0.14 : 0 }}
        >
          <p style={{
            fontFamily: "'Space Mono',monospace", fontSize: "0.62rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: `${accent}bb`, marginBottom: 12, fontWeight: 700,
          }}>Top 3 Wins</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(item as any).points?.map((pt: string, j: number) => (
              <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: 1, flexShrink: 0, marginTop: 5,
                  background: accent, display: "inline-block",
                  transform: "rotate(45deg)",
                  boxShadow: `0 0 10px ${accent}99`,
                }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(224,242,236,0.82)", lineHeight: 1.5, fontFamily: "'Kanit',sans-serif", fontWeight: 400 }}>{pt}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Education card — static, with skill bubble list ───────────── */

function EduCard({ item, index }: { item: Card; index: number }) {
  const accent = item.color;
  const skills = ((item as any).skills as string[] | undefined) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 32,
        background: CARD_BG[index % CARD_BG.length],
        boxShadow: CARD_SHADOWS[index % CARD_SHADOWS.length],
        border: "1px solid rgba(11,42,36,0.05)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(24px, 3.4vw, 40px)",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2.8vw, 32px)", marginBottom: 28 }}>
        <div style={{
          width: "clamp(88px, 8vw, 108px)", height: "clamp(88px, 8vw, 108px)",
          flexShrink: 0, borderRadius: 20,
          border: `1.5px solid ${accent}22`,
          background: (item as any).logoBg || (item.logo ? "#fff" : `${accent}10`),
          boxShadow: item.logo ? "0 6px 18px rgba(11,42,36,0.12)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", padding: item.logo ? 8 : 0,
        }}>
          {item.logo ? (
            <img src={item.logo} alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 900, fontSize: "1.4rem", color: accent }}>{item.abbr}</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: (item as any).badge === "Graduated" ? "#5A7A6E" : "#0D9488",
              border: `1px solid ${(item as any).badge === "Graduated" ? "#5A7A6E" : "#0D9488"}40`,
              padding: "3px 10px", borderRadius: 99,
            }}>{(item as any).badge}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#8AABA0", letterSpacing: "0.04em" }}>{(item as any).dates}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#8AABA0" }}>{(item as any).location}</span>
          </div>

          <h3 style={{
            fontFamily: "'Kanit', sans-serif", fontWeight: 900,
            fontSize: "clamp(1.4rem, 2.8vw, 2.1rem)", color: "#0B2A24",
            lineHeight: 1.05, marginBottom: 8,
            textTransform: "uppercase", letterSpacing: "-0.01em",
          }}>{item.name}</h3>

          <p style={{
            fontFamily: "'Kanit', sans-serif", fontWeight: 600,
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            color: accent, letterSpacing: "-0.005em",
          }}>{item.role}</p>
        </div>
      </div>

      {/* Skill bubbles — side by side, with hover effect */}
      <style>{`
        .edu-skill-bubble {
          transition: transform .25s cubic-bezier(.3,.9,.3,1), box-shadow .25s ease, background .25s ease;
        }
        .edu-skill-bubble:hover {
          transform: translateY(-3px) scale(1.05);
        }
      `}</style>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px, 1.2vw, 12px)" }}>
        {skills.map((s) => (
          <span key={s} className="edu-skill-bubble" style={{
            fontFamily: "'Kanit', sans-serif", fontWeight: 600,
            fontSize: "clamp(0.8rem, 1.2vw, 0.92rem)", color: accent,
            padding: "clamp(8px, 1.2vw, 11px) clamp(14px, 2vw, 20px)",
            borderRadius: 9999,
            background: `${accent}12`,
            border: `1.5px solid ${accent}35`,
            boxShadow: `0 4px 14px ${accent}00`,
            cursor: "default",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 10px 24px ${accent}35`; e.currentTarget.style.background = `${accent}20`; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 4px 14px ${accent}00`; e.currentTarget.style.background = `${accent}12`; }}
          >{s}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Stacking list ─────────────────────────────────────────────── */

function StackingList({ items, tabKey, interactive = true, renderCard }: { items: Card[]; tabKey: string; interactive?: boolean; renderCard?: (item: Card, index: number) => React.ReactNode }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const runScroll = useCallback(() => {
    const vh = window.innerHeight;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      const rect      = el.getBoundingClientRect();
      const stickyTop = STICKY_BASE + i * STICKY_STEP;
      const past      = stickyTop - rect.top;
      const t         = Math.max(0, Math.min(1, past / (vh * 0.6)));
      const scale     = 1 - (1 - TARGET_SCALE) * t;
      inner.style.transform       = `scale(${scale})`;
      inner.style.transformOrigin = "top center";
    });
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, items.length);
    window.addEventListener("scroll", runScroll, { passive: true });
    runScroll();
    return () => window.removeEventListener("scroll", runScroll);
  }, [runScroll, items]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {items.map((item, i) => (
          <div
            key={item.num}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{ position: "sticky", top: STICKY_BASE + i * STICKY_STEP, zIndex: i + 1, marginBottom: 34 }}
          >
            <div style={{ willChange: "transform" }}>
              {renderCard ? renderCard(item, i) : <StackCard item={item} index={i} interactive={interactive} />}
            </div>
          </div>
        ))}
        <div style={{ height: "50vh" }} />
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Cert + Edu adapters ───────────────────────────────────────── */

function toCard(raw: any): Card {
  return {
    num: raw.num, abbr: raw.abbr, name: raw.name,
    logo: raw.logo ?? null, role: raw.role,
    badge: raw.badge ?? "Certified",
    dates: raw.dates ?? "", location: raw.location ?? "",
    color: raw.color, tags: raw.tags ?? [], skills: raw.skills,
    points: raw.points, bars: raw.bars,
  } as unknown as Card;
}

/* ─── Root export ───────────────────────────────────────────────── */

export default function ExperienceSection() {
  const [tab, setTab] = useState<Tab>("Experience");

  const cards: Card[] =
    tab === "Experience"     ? experienceCards :
    tab === "Certifications" ? certCards.map(toCard) :
                               eduCards.map(toCard);

  return (
    <div style={{ background: "#EEF6F1", width: "100%" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        <StickyHeader tab={tab} setTab={setTab} />
        <StackingList
          items={cards}
          tabKey={tab}
          interactive={tab !== "Education"}
          renderCard={tab === "Education" ? (item, i) => <EduCard item={item} index={i} /> : undefined}
        />
      </div>
    </div>
  );
}
