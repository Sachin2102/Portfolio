import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const experienceData = [
  {
    company: "CyberAlliance", logoInitials: "CA", logoColor: "#0D9488", logo: "/logos/cyberalliance.png",
    role: "Cyber Security Product Manager", badge: "Current", dates: "Jun 2026 – Present", location: "Remote",
    tags: ["Security PM", "AI Tooling", "Threat Intel", "Roadmap"],
    metrics: [
      "Driving security product roadmap with AI-powered PM tooling",
      "Enterprise threat intelligence product strategy",
    ],
  },
  {
    company: "Qualys", logoInitials: "Q", logoColor: "#dc2626", logo: "/logos/qualys.png",
    role: "QA Engineer → Product Manager", badge: "Full-time", dates: "Apr 2024 – Jul 2025", location: "Pune, India · Hybrid",
    tags: ["QA → PM", "VMDR", "API Design", "Python/Perl"],
    metrics: [
      "22% reduction in false positives across 35+ enterprise accounts",
      "30% faster patch remediation via RICE-prioritized backlog ownership",
      "40% cut in release validation via custom automation analytics",
    ],
  },
  {
    company: "ShellStrong Technologies", logoInitials: "SS", logoColor: "#059669", logo: "/logos/shellstrong.png",
    role: "Digital Forensic Intern", badge: "Internship", dates: "Jul 2023 – Dec 2023", location: "Pune, India · On-site",
    tags: ["DFIR", "AXIOM", "Cellebrite", "UFED"],
    metrics: [
      "60+ live forensic cases alongside government agencies",
      "95% stakeholder confidence across law enforcement investigations",
      "~20% investigation rework reduction via standardized workflows",
    ],
  },
  {
    company: "Cyber Security Corporation", logoInitials: "CS", logoColor: "#ea580c", logo: null,
    role: "Digital Forensic Intern", badge: "Internship", dates: "Aug 2022 – Oct 2022", location: "Pune, India · On-site",
    tags: ["Autopsy", "FTK", "Chain of Custody", "Reporting"],
    metrics: [
      "15+ cybercrime investigations — email, mobile, and storage media",
      "Tools: Autopsy, FTK — chain-of-custody documentation",
      "Forensic reports for non-technical stakeholders",
    ],
  },
  {
    company: "Pune Metro Rail Project", logoInitials: "PM", logoColor: "#7c3aed", logo: "/logos/pune-metro.png",
    role: "Security Intern", badge: "Internship", dates: "Jun 2022 – Aug 2022", location: "Pune, India · On-site",
    tags: ["Security Audit", "Infrastructure", "Big Data", "Documentation"],
    metrics: [
      "10,000+ passenger records analyzed — identified process gaps",
      "Security baseline documentation adopted by operations team",
      "Big data infrastructure and security protocol analysis",
    ],
  },
];

type Cert = {
  name: string; issuer: string; date: string; id?: string;
  color: string; group: "pm" | "security";
};

const certs: Cert[] = [
  { name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", date: "May 2026", id: "001791116", color: "#E85D26", group: "pm" },
  { name: "Certified ScrumMaster (CSM)", issuer: "Scrum Alliance", date: "Oct 2025", id: "001791116", color: "#F0A500", group: "pm" },
  { name: "Product Management Basics", issuer: "Pendo.io", date: "Jun 2026", color: "#FF4B00", group: "pm" },
  { name: "Enterprise Design Thinking Practitioner", issuer: "IBM", date: "May 2026", color: "#0F62FE", group: "pm" },
  { name: "Product Innovation for Product Managers", issuer: "LinkedIn", date: "Mar 2025", color: "#0A66C2", group: "pm" },
  { name: "Product Management Insights", issuer: "LinkedIn", date: "Mar 2025", color: "#0A66C2", group: "pm" },
  { name: "Ethical Hacking Essentials (EHE)", issuer: "EC-Council", date: "Mar 2024", id: "305947", color: "#B91C1C", group: "security" },
  { name: "Digital Forensics Essentials (DFE)", issuer: "EC-Council", date: "Nov 2023", id: "266372", color: "#B91C1C", group: "security" },
  { name: "Dark Web — Anonymity & Cryptocurrency", issuer: "EC-Council", date: "Jan 2023", color: "#B91C1C", group: "security" },
  { name: "CompTIA PenTest+ Learning Path", issuer: "TryHackMe", date: "Aug 2021", id: "THM-NO1OGPXQ3P", color: "#212C42", group: "security" },
  { name: "Offensive Pentesting Learning Path", issuer: "TryHackMe", date: "Aug 2021", id: "THM-BYQATL9BPO", color: "#212C42", group: "security" },
  { name: "Web Fundamentals Learning Path", issuer: "TryHackMe", date: "Sep 2021", id: "THM-JWZ02PAHJN", color: "#212C42", group: "security" },
  { name: "Pre Security Learning Path", issuer: "TryHackMe", date: "Aug 2021", id: "THM-GCDLXEVUON", color: "#212C42", group: "security" },
  { name: "Complete Beginner Learning Path", issuer: "TryHackMe", date: "Aug 2021", id: "THM-1QWBEZ6WIQ", color: "#212C42", group: "security" },
  { name: "The Complete Cyber Security Course", issuer: "Udemy", date: "Oct 2022", color: "#A435F0", group: "security" },
  { name: "Cyber Shikshaa (Microsoft & DSCI)", issuer: "Quick Heal Academy", date: "Sep 2021", id: "DSCICSB-2021-SYMB09", color: "#E31E24", group: "security" },
];

const CARD_BG = ["#FFFFFF", "#FAFFFE", "#F7FDFB", "#F4FBF8", "#F1FAF5"];
const CARD_SHADOW = [
  "0 2px 24px rgba(11,42,36,0.07)",
  "0 4px 32px rgba(11,42,36,0.10)",
  "0 6px 40px rgba(11,42,36,0.13)",
  "0 8px 50px rgba(11,42,36,0.16)",
  "0 12px 60px rgba(11,42,36,0.20)",
];

type ExpData = typeof experienceData[number];

function ExperienceCard({ item, index }: { item: ExpData; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <motion.div
      style={{
        borderRadius: 40,
        padding: "clamp(24px, 3.5vw, 48px) clamp(24px, 4vw, 56px)",
        background: CARD_BG[index],
        boxShadow: CARD_SHADOW[index],
        border: "1px solid rgba(11,42,36,0.05)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        gap: "clamp(20px, 3vw, 44px)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span style={{
        position: "absolute", left: 14, top: "50%",
        transform: "translateY(-50%) rotate(-90deg)",
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: `${item.logoColor}55`,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}>{num}</span>

      <div style={{
        width: "clamp(72px, 8vw, 96px)",
        height: "clamp(72px, 8vw, 96px)",
        flexShrink: 0,
        borderRadius: 20,
        border: `1.5px solid ${item.logoColor}25`,
        background: item.logo ? "#fff" : `${item.logoColor}12`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "clamp(16px, 2vw, 28px)",
        overflow: "hidden",
        padding: item.logo ? 8 : 0,
      }}>
        {item.logo ? (
          <img
            src={item.logo}
            alt={item.company}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const span = document.createElement("span");
              span.textContent = item.logoInitials;
              span.style.cssText = `font-family:'Kanit',sans-serif;font-weight:900;font-size:1.4rem;color:${item.logoColor};letter-spacing:-0.02em`;
              el.parentElement?.appendChild(span);
            }}
          />
        ) : (
          <span style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
            color: item.logoColor,
            letterSpacing: "-0.02em",
          }}>{item.logoInitials}</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: item.badge === "Current" ? "#0D9488" : "#5A7A6E",
            border: `1px solid ${item.badge === "Current" ? "#0D9488" : "#5A7A6E"}45`,
            padding: "3px 10px",
            borderRadius: 99,
          }}>{item.badge}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#8AABA0", letterSpacing: "0.05em" }}>{item.dates}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#8AABA0" }}>{item.location}</span>
        </div>

        <h3 style={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          color: "#0B2A24",
          lineHeight: 0.95,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
        }}>{item.company}</h3>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "clamp(0.6rem, 1vw, 0.72rem)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: item.logoColor,
          marginBottom: 16,
          fontWeight: 700,
        }}>{item.role}</p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {item.tags.map((t) => (
            <span key={t} style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: `1px solid ${item.logoColor}35`,
              color: item.logoColor,
              padding: "4px 10px",
              borderRadius: 99,
              background: `${item.logoColor}08`,
            }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute",
        bottom: -50, right: -50,
        width: 220, height: 220,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${item.logoColor}18 0%, transparent 68%)`,
        pointerEvents: "none",
      }} />
    </motion.div>
  );
}

const EXP_BASE_TOP = 72;
const EXP_STAGGER  = 24;

function ExperienceStack() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState(() => experienceData.map(() => 1));

  const handleScroll = useCallback(() => {
    setScales(
      experienceData.map((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return 1;
        const rect      = el.getBoundingClientRect();
        const stickyTop = EXP_BASE_TOP + i * EXP_STAGGER;
        const pushed    = stickyTop - rect.top;
        const t         = Math.max(0, Math.min(1, pushed / el.offsetHeight));
        return 1 - 0.04 * t;
      })
    );
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div style={{ position: "relative" }}>
      {experienceData.map((item, i) => (
        <div
          key={item.company}
          ref={(el) => { cardRefs.current[i] = el; }}
          style={{ marginBottom: i < experienceData.length - 1 ? 24 : 0 }}
        >
          <div style={{ position: "sticky", top: EXP_BASE_TOP + i * EXP_STAGGER, zIndex: i + 1 }}>
            <div style={{ transform: `scale(${scales[i]})`, transformOrigin: "top center", transition: "transform 40ms linear" }}>
              <ExperienceCard item={item} index={i} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CertCard({ cert, index, visible }: { cert: Cert; index: number; visible: boolean }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(11,26,20,0.08)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.97)",
        transition: `opacity 450ms ease ${index * 55}ms, transform 450ms ease ${index * 55}ms`,
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: cert.color, flexShrink: 0 }} />
        <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: cert.color }}>{cert.issuer}</span>
        <span style={{ marginLeft: "auto", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", color: "#5A7A6E" }}>{cert.date}</span>
      </div>
      <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0B1A14", lineHeight: 1.4 }}>{cert.name}</p>
      {cert.id && <p style={{ fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", color: "#5A7A6E", marginTop: 4 }}>ID · {cert.id}</p>}
    </div>
  );
}

function CertificationsTab() {
  const [filter, setFilter] = useState<"all" | "pm" | "security">("all");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const filtered = filter === "all" ? certs : certs.filter((c) => c.group === filter);
  return (
    <div ref={ref}>
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {(["all", "pm", "security"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={filter === f
              ? { padding: "6px 16px", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 700, background: "#0D9488", color: "#fff", border: "1px solid #0D9488", cursor: "pointer" }
              : { padding: "6px 16px", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 700, background: "transparent", color: "#3E5A4E", border: "1px solid rgba(11,26,20,0.15)", cursor: "pointer" }}>
            {f === "all" ? `All (${certs.length})` : f === "pm" ? `PM (${certs.filter(c => c.group === "pm").length})` : `Security (${certs.filter(c => c.group === "security").length})`}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {filtered.map((cert, i) => (
          <CertCard key={cert.name} cert={cert} index={i} visible={visible} />
        ))}
      </div>
    </div>
  );
}

function EduCard({ accent, label, degree, field, period, chips, tags, quote, delay = 0 }: {
  accent: string; label: string; degree: string; field: string;
  period: string; chips: { label: string; color: string }[];
  tags: string[]; quote: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}
      style={{
        borderRadius: 24, padding: "clamp(1.5rem,3vw,2.5rem)",
        background: "#FFFFFF", border: `1.5px solid ${accent}30`,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms`,
      }}>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: "0.6rem", fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.18em", color: accent, marginBottom: 8 }}>{label}</p>
        <h3 style={{ fontFamily: "'Kanit',sans-serif", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: "#0B1A14", lineHeight: 1.1, marginBottom: 4 }}>{degree}</h3>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: `${accent}cc`, fontWeight: 700 }}>{field}</p>
      </div>
      <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "rgba(11,26,20,0.55)", borderLeft: `2px solid ${accent}60`, paddingLeft: 12, lineHeight: 1.6, margin: "16px 0" }}>{quote}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: "0.65rem", fontFamily: "'Space Mono',monospace", color: "#5A7A6E" }}>{period}</span>
        {chips.map(c => (
          <span key={c.label} style={{ padding: "2px 10px", borderRadius: 9999, fontSize: "0.65rem", fontWeight: 700, background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}45` }}>{c.label}</span>
        ))}
        {tags.slice(0, 3).map(t => (
          <span key={t} style={{ padding: "2px 10px", borderRadius: 9999, fontSize: "0.6rem", textTransform: "uppercase", background: `${accent}15`, color: accent, border: `1px solid ${accent}35` }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function EducationTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <EduCard accent="#CC0000"
        label="NC State University · Raleigh, NC"
        degree="Master of Engineering Management (MEM)"
        field="Engineering / Industrial Management"
        period="Aug 2025 – May 2027"
        chips={[{ label: "Raleigh, NC", color: "#CC0000" }, { label: "In Progress", color: "#0B1A14" }]}
        tags={["Engineering Leadership", "Product Strategy", "Systems Thinking"]}
        quote='"The degree that bridges forensic instincts with product leadership at scale."'
        delay={0} />
      <EduCard accent="#C0392B"
        label="Symbiosis Skills & Professional University"
        degree="Bachelor of Technology (BTech)"
        field="Computer Science & IT — Cyber Security"
        period="Aug 2020 – Jul 2024"
        chips={[{ label: "8.9 CGPA", color: "#C0392B" }, { label: "Graduated", color: "#0B1A14" }]}
        tags={["Cybersecurity", "Networking", "Digital Forensics"]}
        quote='"Where the obsession with cyber began — crime scenes, networks, and code, all at once."'
        delay={80} />
    </div>
  );
}

export default function CareerPanel() {
  const [activeTab, setActiveTab] = useState<"Experience" | "Certifications" | "Education">("Experience");

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        display: "flex", justifyContent: "center",
        paddingTop: "1rem", paddingBottom: "1.5rem",
        background: "linear-gradient(to bottom, #D6EEE4 70%, transparent)",
      }}>
        <div className="flex overflow-x-auto hide-scrollbar"
          style={{
            background: "rgba(11,26,20,0.06)",
            borderRadius: 16, padding: "5px 6px", gap: 4,
            width: "fit-content", maxWidth: "100%",
          }}>
          {(["Experience", "Certifications", "Education"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: "9px 22px", borderRadius: 12,
                  fontSize: "0.82rem", fontWeight: 600,
                  letterSpacing: "0.02em", border: "none", cursor: "pointer",
                  background: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "#0B1A14" : "#5A7A6E",
                  boxShadow: isActive ? "0 1px 6px rgba(11,26,20,0.10), 0 0 0 1px rgba(11,26,20,0.06)" : "none",
                  position: "relative",
                }}>
                {isActive && (
                  <span style={{
                    position: "absolute", bottom: 5, left: "50%",
                    transform: "translateX(-50%)",
                    width: 20, height: 2, borderRadius: 9999,
                    background: "linear-gradient(90deg, #0D9488, #16A34A)",
                    display: "block",
                  }} />
                )}
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {activeTab === "Experience" && <ExperienceStack key="experience" />}
        {activeTab === "Certifications" && <CertificationsTab />}
        {activeTab === "Education" && <EducationTab />}
      </div>
    </div>
  );
}
