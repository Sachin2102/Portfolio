import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const C = {
  mint:   "#EEF6F1",
  deep:   "#0B2A24",
  deeper: "#071F18",
  ink:    "#0B1A14",
  muted:  "#3E5A4E",
  dim:    "#5A7A6E",
  accent: "#0D9488",
  green:  "#16A34A",
  lime:   "#65A30D",
};

const PROJECTS = [
  {
    index: "01",
    name: "NEXUS",
    accent: "#7c3aed",
    accentAlt: "#a78bfa",
    category: "Autonomous AI · LangGraph · Multi-Agent",
    description:
      "Autonomous multi-agent system that handles email triage, meeting intelligence, project health monitoring, and decision routing — with automatic sending at ≥88% confidence and a complete audit trail on every action.",
    metrics: [
      ["75", "%", "Automation"],
      ["4", "", "AI Agents"],
      ["88", "%+", "Confidence"],
      ["100", "%", "Audit Trail"],
    ] as [string, string, string][],
    tech: ["Python", "LangGraph", "FastAPI", "Next.js 14", "TypeScript", "NVIDIA NIM", "ChromaDB", "PostgreSQL", "Docker", "WebSocket"],
    github: "https://github.com/Sachin2102/Nexus",
    demo: "https://youtu.be/25n4Kv7HWWQ",
  },
  {
    index: "02",
    name: "KURNICUS",
    accent: "#0D9488",
    accentAlt: "#22d3ee",
    category: "Kernel Security · Linux · IoT & Automotive",
    description:
      "Kernel-native security telemetry platform for IoT, embedded, and automotive environments. Traces syscalls with <3% CPU overhead, supports offline edge sync, and aligns with ISO 21434 and NIST Cybersecurity Framework.",
    metrics: [
      ["3", "%", "CPU Overhead"],
      ["10", "+", "Modules"],
      ["256", "MB", "Min RAM"],
      ["0", "", "Config"],
    ] as [string, string, string][],
    tech: ["Bash", "Python", "Flask", "React", "AWS S3", "AWS EC2", "tshark", "inotify", "ApexCharts", "Material UI"],
    github: "https://github.com/Sachin2102/kurnicus",
    demo: null,
  },
];

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

function MetricPill({ value, suffix, label, accent, accentAlt }: { value: string; suffix: string; label: string; accent: string; accentAlt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!isInView || isNaN(target)) return;
    const dur = 1100;
    const inc = target / (dur / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setDisplayed(Math.floor(cur));
      if (cur >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [isInView, target]);

  const displayVal = isNaN(target) ? value : displayed;

  return (
    <div
      ref={ref}
      style={{
        padding: "10px 16px", borderRadius: 14, textAlign: "center",
        background: `rgba(${hexToRgb(accent)},0.15)`,
        border: `1px solid rgba(${hexToRgb(accent)},0.35)`,
        minWidth: 72,
      }}
    >
      <div style={{
        fontFamily: "'Kanit',sans-serif", fontWeight: 900, fontSize: "1.15rem",
        background: `linear-gradient(135deg, ${accent}, ${accentAlt})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        lineHeight: 1.1,
      }}>
        {displayVal}{suffix}
      </div>
      <div style={{
        fontFamily: "'Space Mono',monospace", fontSize: "0.5rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: `rgba(${hexToRgb(accentAlt)},0.55)`,
        marginTop: 3,
      }}>{label}</div>
    </div>
  );
}

function ProjectCard({ p, idx }: { p: typeof PROJECTS[number]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.12 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative", overflow: "hidden",
        borderRadius: 32, cursor: "pointer",
        border: "1.5px solid rgba(11,26,20,0.1)",
        background: "#FFFFFF", minHeight: 460,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Default face */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 14, pointerEvents: "none",
        }}
        animate={hovered ? { x: "-25%", opacity: 0, scale: 0.92 } : { x: "0%", opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.32, 0, 0.18, 1] }}
      >
        <span style={{
          position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)",
          fontSize: "clamp(14rem,40vw,34rem)", lineHeight: 1, whiteSpace: "nowrap",
          fontFamily: "'Kanit',sans-serif", fontWeight: 900, opacity: 0.04,
          userSelect: "none",
          background: `linear-gradient(135deg, ${p.accent}, ${p.accentAlt})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>{p.index}</span>

        <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 2rem" }}>
          <p style={{
            fontFamily: "'Space Mono',monospace", fontSize: "0.62rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(11,26,20,0.28)", marginBottom: 12,
          }}>{p.category}</p>
          <h3 style={{
            fontFamily: "'Kanit',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.8rem,9vw,5.5rem)", letterSpacing: "-0.04em", lineHeight: 0.95,
            background: `linear-gradient(135deg, ${p.accent}, ${p.accentAlt})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{p.name}</h3>
        </div>

        <p style={{
          fontFamily: "'Space Mono',monospace", fontSize: "0.6rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(11,26,20,0.2)", position: "relative", zIndex: 1, marginTop: 6,
        }}>hover to reveal</p>
      </motion.div>

      {/* Revealed dark panel */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "clamp(1.6rem,3vw,2.2rem) clamp(1.6rem,4vw,2.8rem)",
          background: "linear-gradient(135deg, #071F18 0%, #0B2A24 55%, #081C16 100%)",
          pointerEvents: hovered ? "auto" : "none",
        }}
        animate={hovered ? { x: "0%", opacity: 1 } : { x: "100%", opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.32, 0, 0.18, 1] }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{
              fontFamily: "'Space Mono',monospace", fontSize: "0.6rem",
              letterSpacing: "0.2em", textTransform: "uppercase", color: "#22B573", marginBottom: 6,
            }}>{p.category}</p>
            <h3 style={{
              fontFamily: "'Kanit',sans-serif", fontWeight: 900,
              textTransform: "uppercase", lineHeight: 1,
              fontSize: "clamp(1.6rem,4vw,2.4rem)",
              background: `linear-gradient(135deg, ${p.accent}, ${p.accentAlt})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>{p.name}</h3>
          </div>
          <span style={{
            fontFamily: "'Kanit',sans-serif", fontWeight: 900, lineHeight: 1,
            fontSize: "clamp(2.2rem,4.5vw,3.8rem)", opacity: 0.18,
            background: `linear-gradient(135deg, ${C.accent}, ${C.green}, ${C.lime})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{p.index}</span>
        </div>

        <motion.p
          style={{
            fontFamily: "'Kanit',sans-serif", fontWeight: 300,
            lineHeight: 1.75, color: "rgba(224,242,236,0.65)",
            fontSize: "clamp(0.78rem,1.4vw,0.9rem)",
          }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: hovered ? 0.16 : 0 }}
        >{p.description}</motion.p>

        <motion.div
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: hovered ? 0.22 : 0 }}
        >
          {p.metrics.map(([val, suf, label]) => (
            <MetricPill key={label} value={val} suffix={suf} label={label} accent={p.accent} accentAlt={p.accentAlt} />
          ))}
        </motion.div>

        <motion.div
          style={{
            borderTop: "1px solid rgba(224,242,236,0.07)", paddingTop: 14,
            display: "flex", flexDirection: "column", gap: 10,
          }}
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: hovered ? 0.3 : 0 }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={p.github} target="_blank" rel="noopener noreferrer"
              style={{
                padding: "8px 20px", borderRadius: 9999, fontSize: "0.72rem",
                fontFamily: "'Kanit',sans-serif", fontWeight: 700, letterSpacing: "0.07em",
                textTransform: "uppercase", textDecoration: "none",
                background: `linear-gradient(90deg, ${p.accent}, ${p.accentAlt})`,
                color: "#fff", display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >GitHub →</a>
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: "8px 20px", borderRadius: 9999, fontSize: "0.72rem",
                  fontFamily: "'Kanit',sans-serif", fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase", textDecoration: "none",
                  background: "rgba(224,242,236,0.08)", color: "rgba(224,242,236,0.65)",
                  border: "1px solid rgba(224,242,236,0.16)",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >▶ Demo</a>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {p.tech.slice(0, 7).map(t => (
              <span key={t} style={{
                padding: "3px 10px", borderRadius: 9999, fontSize: "0.58rem",
                fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em",
                background: `rgba(${hexToRgb(p.accent)},0.12)`, color: p.accentAlt,
                border: `1px solid rgba(${hexToRgb(p.accent)},0.25)`, display: "inline-block",
              }}>{t}</span>
            ))}
            {p.tech.length > 7 && (
              <span style={{
                padding: "3px 10px", borderRadius: 9999, fontSize: "0.58rem",
                fontFamily: "'Space Mono',monospace", letterSpacing: "0.04em",
                background: "rgba(224,242,236,0.05)", color: "rgba(224,242,236,0.35)",
                border: "1px solid rgba(224,242,236,0.1)", display: "inline-block",
              }}>+{p.tech.length - 7}</span>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!hovered && (
          <motion.div
            style={{
              position: "absolute", right: 20, top: "50%",
              transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6,
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 0.15, 0.3].map((d) => (
              <motion.div key={d}
                style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(11,26,20,0.22)" }}
                animate={{ x: [0, 5, 0], opacity: [0.25, 0.7, 0.25] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: d, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const CHARS = "Project".split("");

function ProjectsHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "clamp(1.5rem,3vw,3rem)", position: "relative", zIndex: 1 }}>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: C.dim, marginBottom: 10 }}>Built from Scratch</p>
      <div ref={ref} style={{ overflow: "hidden" }}>
        <div style={{ display: "inline-flex" }}>
          {CHARS.map((char, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: "'Kanit',sans-serif", fontWeight: 900, textTransform: "uppercase",
                display: "inline-block", fontSize: "clamp(3rem,12vw,11rem)", lineHeight: 1,
                background: `linear-gradient(135deg, ${C.accent} 0%, ${C.green} 50%, ${C.lime} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
              initial={{ y: "110%", opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
              transition={{ duration: 0.72, delay: i * 0.048, ease: [0.22, 1, 0.36, 1] }}
            >{char}</motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

const PROJ_BASE_TOP   = 96;   // px — clears any fixed nav
const PROJ_STAGGER    = 22;   // px — stagger between pinned cards
const PROJ_TARGET_SCALE = 0.92;

export default function ProjectsSection() {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handler = () => {
      const vh = window.innerHeight;
      wrapperRefs.current.forEach((el, i) => {
        if (!el) return;
        const inner = el.firstElementChild as HTMLElement | null;
        if (!inner) return;
        const rect     = el.getBoundingClientRect();
        const stickyTop = PROJ_BASE_TOP + i * PROJ_STAGGER;
        const past      = stickyTop - rect.top;
        const t         = Math.max(0, Math.min(1, past / (vh * 0.6)));
        const scale     = 1 - (1 - PROJ_TARGET_SCALE) * t;
        inner.style.transform       = `scale(${scale})`;
        inner.style.transformOrigin = "top center";
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section
      id="projects"
      style={{
        position: "relative", zIndex: 10,
        padding: "clamp(2rem,4vw,4rem) clamp(1.25rem,4vw,2.5rem) clamp(4rem,8vw,7rem)",
        background: C.mint,
        borderRadius: "40px 40px 0 0", marginTop: -40,
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <motion.div
          style={{ position: "absolute", top: "5%", left: "-8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)" }}
          animate={{ x: [0, 28, 0], y: [0, 18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ position: "absolute", bottom: "5%", right: "-6%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(101,163,13,0.06) 0%, transparent 70%)" }}
          animate={{ x: [0, -22, 0], y: [0, -18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <ProjectsHeading />

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {PROJECTS.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => { wrapperRefs.current[i] = el; }}
            style={{
              position: "sticky",
              top: PROJ_BASE_TOP + i * PROJ_STAGGER,
              zIndex: i + 1,
              marginBottom: 34,
            }}
          >
            {/* inner div is scaled by the scroll handler */}
            <div style={{ willChange: "transform" }}>
              <ProjectCard p={p} idx={i} />
            </div>
          </div>
        ))}
        {/* scroll room so the last card can unstick naturally */}
        <div style={{ height: "40vh" }} />
      </div>
    </section>
  );
}
