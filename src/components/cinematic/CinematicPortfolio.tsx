import React, { useEffect, useRef, useState, useCallback } from "react";

/* ── fixed mint theme ─────────────────────────────────────────── */
const T = {
  acc: "#34d8ad", acc2: "#4ff0bd", rgb: "52,216,173",
  bg0: "#04100b", bg1: "#061b13", bg2: "#0a2418",
  txt: "#f2f9f5", mut: "rgba(206,232,222,.6)",
};

/* ── global keyframes / base styles (once) ───────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      #cinema{font-family:'Hanken Grotesk',system-ui,sans-serif}
      .cin-grain{position:absolute;inset:-60px;pointer-events:none;z-index:6;opacity:.06;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");background-size:200px;animation:cin-grain 1.1s steps(3) infinite}
      @keyframes cin-grain{0%{transform:translate(0,0)}50%{transform:translate(3%,-4%)}100%{transform:translate(-3%,3%)}}
      @keyframes cin-riseIn{0%{opacity:0;transform:translateY(112%)}100%{opacity:1;transform:translateY(0)}}
      @keyframes cin-fadeUp{0%{opacity:0;transform:translateY(26px)}100%{opacity:1;transform:translateY(0)}}
      @keyframes cin-dotPulse{0%,100%{opacity:.4;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}
      @keyframes cin-scanDrift{0%{transform:translateY(-30%)}100%{transform:translateY(130%)}}
      @keyframes cin-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes cin-marqR{from{transform:translateX(-50%)}to{transform:translateX(0)}}
      @keyframes cin-arrow{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
      .cin-mrow:hover>div{animation-play-state:paused}
      .cin-cta:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 18px 42px rgba(52,216,173,.45)}
      .cin-cta:active{transform:translateY(0) scale(0.98)}
      @keyframes cin-tabFloat{0%,100%{margin-top:0}50%{margin-top:-10px}}
      .cin-scrollx{scrollbar-width:none;-ms-overflow-style:none;min-width:0}
      .cin-scrollx::-webkit-scrollbar{display:none}
      @media (max-width:680px){
        .cin-navlinks{overflow-x:auto;flex-wrap:nowrap!important;flex:1 1 auto;max-width:none;-webkit-overflow-scrolling:touch;justify-content:flex-start!important}
        .cin-navloc{display:none!important}
        .cin-logo{font-size:20px!important}
      }
      @media (max-width:640px){
        .cin-dockpill{overflow-x:auto;-webkit-overflow-scrolling:touch;flex-wrap:nowrap!important}
        .cin-dockpill>button{padding:12px 18px!important;font-size:11px!important}
        .cin-floatswitch{
          left:50%!important; right:auto!important; top:auto!important; bottom:16px!important;
          transform:translateX(-50%)!important; max-width:none!important; animation:none!important;
        }
        .cin-floatswitch-inner{
          flex-direction:row!important; width:auto!important; border-radius:18px!important;
          padding:6px!important; margin-left:0!important;
          border:1px solid rgba(52,216,173,.3)!important;
        }
        .cin-floatswitch-inner button{ padding:11px!important; gap:0!important; }
        .cin-tabswitch-label{ display:none; }
        .cin-tabswitch-indicator{ display:none; }
      }
      @media (prefers-reduced-motion: reduce){ .cin-reveal-fwd{animation:none!important;opacity:1!important;transform:none!important} }
    `}</style>
  );
}

/* ── reveal-on-scroll wrapper ─────────────────────────────────── */
function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(30px)",
      transition: "opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)",
      ...style,
    }}>{children}</div>
  );
}

/* ── particle mesh canvas ─────────────────────────────────────── */
function useParticleMesh(canvasRef: React.RefObject<HTMLCanvasElement | null>, N: number) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, DPR = 1;
    const mouse = { x: -9999, y: -9999 };
    const resize = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, W * DPR); canvas.height = Math.max(1, H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const host = canvas.parentElement;
    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    host?.addEventListener("pointermove", onMove);
    host?.addEventListener("pointerleave", onLeave);

    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      sq: Math.random() < 0.32, r: 1 + Math.random() * 1.4,
    }));
    const LINK = 148;
    const pulses: { a: number; b: number; t: number; sp: number }[] = [];
    let raf = 0;
    const draw = () => {
      const rgb = T.rgb;
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y, md = Math.hypot(dx, dy);
        if (md < 120) { n.x += dx / md * 0.6; n.y += dy / md * 0.6; }
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          const near = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < 160 ? 0.22 : 0;
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / LINK) * (0.1 + near)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      for (const n of nodes) {
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < 130;
        ctx.fillStyle = `rgba(${rgb},${near ? 0.95 : 0.42})`;
        if (n.sq) { const s = n.r * 1.7; ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s); }
        else { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill(); }
      }
      if (pulses.length < 9 && Math.random() < 0.14) {
        const i = (Math.random() * N) | 0;
        let best = -1, bd = LINK;
        for (let j = 0; j < N; j++) {
          if (j === i) continue;
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < bd && d > 30) { bd = d; best = j; }
        }
        if (best >= 0) pulses.push({ a: i, b: best, t: 0, sp: 0.012 + Math.random() * 0.02 });
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]; p.t += p.sp;
        if (p.t >= 1) { pulses.splice(k, 1); continue; }
        const a = nodes[p.a], b = nodes[p.b], x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath(); ctx.arc(x, y, 2.1, 0, 6.283); ctx.fillStyle = `rgba(${rgb},.95)`; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.283); ctx.fillStyle = `rgba(${rgb},.14)`; ctx.fill();
      }
      if (mouse.x > -9000) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
        g.addColorStop(0, `rgba(${rgb},.07)`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
    };
  }, [canvasRef, N]);
}

/* ── cursor glow overlay ──────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const glow = ref.current;
    if (!glow) return;
    let raf = 0, mx = -9999, my = -9999;
    const paint = () => {
      glow.style.background = `radial-gradient(260px 260px at ${mx}px ${my}px, rgba(${T.rgb},.14), transparent 72%)`;
      raf = 0;
    };
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
    const leave = () => { mx = -9999; my = -9999; if (!raf) raf = requestAnimationFrame(paint); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerleave", leave); };
  }, []);
  return <div ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60, mixBlendMode: "screen" }} />;
}

/* ── visitor location — resolved from their IP via a geolocation API ── */
function useVisitorLocation() {
  const [location, setLocation] = useState("LOCATING...");
  useEffect(() => {
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const city = data.city as string | undefined;
        const region = (data.region_code || data.region) as string | undefined;
        const country = data.country_name as string | undefined;
        const label = city ? [city, region || country].filter(Boolean).join(", ") : (country ?? "UNKNOWN");
        setLocation(label.toUpperCase());
      })
      .catch(() => { if (!cancelled) setLocation("UNKNOWN"); });
    return () => { cancelled = true; };
  }, []);
  return location;
}

/* ── data ─────────────────────────────────────────────────────── */
const skills1 = ["Product Strategy", "Security Architecture", "Roadmap Planning", "User Research", "Agile / Scrum", "Threat Modeling", "Data Analysis", "Stakeholder Mgmt", "Digital Forensics", "Go-to-Market", "A/B Testing", "OKR Frameworks"];
const skills2 = ["Ethical Hacking", "Enterprise SaaS", "SQL & Python", "JIRA & Confluence", "Design Thinking", "AI Product Ops", "Cybersecurity PM", "Cross-func Leadership", "Penetration Testing", "Sprint Facilitation"];
const BIO = "0-1 builder at the intersection of cybersecurity and AI, whether shipping inside an enterprise platform or building from scratch on my own. I turn ambiguous problems into shipped product by pairing technical depth with product instinct, partnering across engineering, security, and leadership to build things that are trusted, not just functional.";
/* Hero content */
// Words are paired two-at-a-time into headline lines; the second word of each
// pair renders in the italic accent style. An odd word count leaves the last
// word on its own plain line. See buildHeroLines() below.
const HERO_HEADLINE = ["Building", "Products", "and", "Experiences", "that", "Inspire", "Trust", "and", "create", "real", "Impact."];
const HERO_NAME = "Sachin Rai";

/* Footer content */
const FOOTER_EMAIL = "sachin.rai2113@gmail.com";
const FOOTER_LINE_1 = "Whether you need a";
const FOOTER_LINE_1_ACCENT = "PM who builds";
const FOOTER_LINE_2 = "want to discuss";
const FOOTER_LINE_2_ACCENT = "AI systems";
const FOOTER_LINE_3 = "or just want to say hi —";
const FOOTER_SIGNOFF = "Sachin Rai · Cybersecurity PM · 2026";
const FOOTER_LINKEDIN = "https://www.linkedin.com/in/sachin-rai21/";
const FOOTER_GITHUB = "https://github.com/Sachin2102";

type JCard = { num: string; name: string; logo: string | null; logoBg?: string; abbr?: string; role: string; badge: string; dates: string; location: string; tags: string[]; points: string[] };

const experience: JCard[] = [
  { num: "01", name: "CyberAlliance", logo: "/logos/cyberalliance.png", role: "Cyber Security Product Manager", badge: "Current", dates: "Jun 2026 – Present", location: "Raleigh, NC", tags: ["Product Strategy", "Roadmap Planning", "Agile Methodology", "Go-To-Market Strategy"], points: ["Defined product requirements, user stories, and acceptance criteria for Sally AI, translating cybersecurity workflows into clear engineering deliverables", "Drove product roadmap planning and backlog prioritization using RICE and MoSCoW frameworks, aligning feature development with business goals and user needs", "Partnered with developers, and leadership teams to transform customer feedback, security telemetry, and market research into AI-powered cybersecurity product features"] },
  { num: "02", name: "Qualys", logo: "/logos/qualys.png", role: "QA Engineer", badge: "Full-time", dates: "Apr 2024 – Jul 2025", location: "Pune · Hybrid", tags: ["Product Security", "Vulnerability Detection", "Python Automation", "Linux"], points: ["Reduced vulnerability false positives by 22%, improving detection accuracy and strengthening product reliability across 35+ customer environments", "Developed automation frameworks that accelerated release validation by 40%, enabling faster software delivery and improving engineering efficiency", "Partnered with Product Managers and Engineering teams to analyze customer feedback, prioritize critical issues, and deliver high-quality security features through Agile development"] },
  { num: "03", name: "ShellStrong Technologies", logo: "/logos/shellstrong.png", logoBg: "#0a2418", role: "Digital Forensic Intern", badge: "Internship", dates: "Jul 2023 – Dec 2023", location: "Pune · On-site", tags: ["Evidence Acquisition", "Data Recovery", "File System Analysis"], points: ["Investigated 60+ digital forensic cases, acquiring, preserving, and analyzing digital evidence while maintaining strict chain-of-custody standards for law enforcement investigations", "Performed forensic analysis of mobile devices, computers, and storage media, recovering critical artifacts and producing investigation-ready reports for legal proceedings", "Streamlined digital forensic investigations using industry-standard methodologies, delivering actionable findings that supported government agencies and enterprise stakeholders in critical investigations"] },
  { num: "04", name: "Pune Metro Rail Project", logo: "/logos/pune-metro.png", role: "Security Intern", badge: "Internship", dates: "Jun 2022 – Aug 2022", location: "Pune · On-site", tags: ["Security Audit", "Infrastructure", "Big Data"], points: ["10,000+ passenger records analyzed, identified process gaps", "Security baseline documentation adopted by operations team", "Big data infrastructure and security protocol analysis"] },
];
const certs: JCard[] = [
  { num: "01", name: "Certified Scrum Product Owner", logo: "/logos/CSPO.png", abbr: "CSPO", role: "CSPO · Scrum Alliance", badge: "Certified", dates: "May 2026", location: "ID 001791116", tags: ["PM", "Agile"], points: ["Agile product ownership and backlog prioritization", "Sprint planning across cross-functional teams", "Stakeholder communication and release planning"] },
  { num: "02", name: "Certified ScrumMaster", logo: "/logos/CSM.png", abbr: "CSM", role: "CSM · Scrum Alliance", badge: "Certified", dates: "Oct 2025", location: "ID 001791116", tags: ["PM", "Scrum"], points: ["Facilitate Scrum ceremonies and remove blockers", "Coach teams toward continuous delivery", "Agile metrics and retrospective facilitation"] },
  { num: "03", name: "Enterprise Design Thinking", logo: "/logos/IBM.png", abbr: "IBM", role: "Practitioner · IBM", badge: "Certified", dates: "May 2026", location: "", tags: ["PM", "UX"], points: ["User-centred product design at enterprise scale", "Empathy mapping and rapid prototyping", "Hill statement and playback facilitation"] },
  { num: "04", name: "Ethical Hacking Essentials", logo: "/logos/EC_Council.png", abbr: "EHE", role: "EHE · EC-Council", badge: "Certified", dates: "Mar 2024", location: "ID 305947", tags: ["Security"], points: ["Network scanning and vulnerability identification", "Exploitation and post-exploitation methodology", "Ethical hacking tools and reporting"] },
  { num: "05", name: "Digital Forensics Essentials", logo: "/logos/EC_Council.png", abbr: "DFE", role: "DFE · EC-Council", badge: "Certified", dates: "Nov 2023", location: "ID 266372", tags: ["Security"], points: ["Digital evidence acquisition and preservation", "File-system forensics and timeline analysis", "Chain-of-custody and legal documentation"] },
  { num: "06", name: "CompTIA PenTest+ Path", logo: "/logos/tryhackme.png", abbr: "THM", role: "TryHackMe", badge: "Certified", dates: "Aug 2021", location: "THM-NO1OGPXQ3P", tags: ["Security"], points: ["Recon, scanning, exploitation, and reporting", "Structured PenTest+ learning path completion", "Hands-on CTF labs and real-world scenarios"] },
  { num: "07", name: "Product Management Basics Certification", logo: "/logos/Pendo_PM.png", abbr: "PM", role: "Pendo.io", badge: "Certified", dates: "Jun 2026", location: "", tags: ["Product Management", "Customer Success", "Data Analysis", "Product Requirements (PRD)", "Product-Led Growth"], points: ["Core product management fundamentals — discovery to delivery", "Customer success and data-driven prioritization frameworks", "Product-led growth strategy and PRD authoring"] },

];
const edu: JCard[] = [
  { num: "01", name: "North Carolina State University", logo: "/logo-ncstate.png", role: "Master of Engineering Management", badge: "In Progress", dates: "Aug 2025 – May 2027", location: "Raleigh, NC", tags: ["Product Management", "Project Management", "Product Life Cycle Management", "Managing New Product Creation", "Finance"], points: [] },
  { num: "02", name: "Symbiosis Skills University", logo: "/logo-sspu.png", role: "Computer Sciences and Information Technology specialising in Cybersecurity", badge: "Graduated", dates: "Aug 2020 – Jul 2024", location: "Pune, India", tags: ["Cloud Computing", "Python", "Big Data Analysis", "Cyber Threat Management", "SDLC Processes", "AI & Neural Networks"], points: [] },
];

const caseStudies = [
  { num: "01", logo: "/grammarly.png", eyebrow: "Freemium SaaS · Conversion", title: "Why 30M Daily Users Don't Pay", body: "A product teardown of Grammarly's monetization gap, where $0.70 in user revenue meets a $12/month Pro plan. It includes three personas, a matrix comparing eight tools, and four product changes with associated metrics.", chips: [{ k: "30M+", v: "Daily Users" }, { k: "$13B", v: "Valuation" }, { k: "~5%", v: "Conversion" }], cta: "Read Case Study", href: "/case-study/grammarly" },
  { num: "02", logo: "/whatsapp.png", eyebrow: "B2B Platform · Monetisation", title: "Scaling B2B To 2B Users", body: "A comprehensive analysis of WhatsApp's B2B growth and monetization model, focusing on the Business API, platform strategy, and how over 2 billion users convert into enterprise revenue.", chips: [], cta: "Coming Soon", href: null },
];

const projects = [
  { index: "01", name: "Nexus", category: "Autonomous AI · LangGraph · Multi-Agent", description: "Autonomous multi-agent system that handles email triage, meeting intelligence, project health monitoring, and decision routing, with automatic sending at ≥88% confidence and a complete audit trail on every action.", metrics: [{ v: "75%", l: "Automation" }, { v: "4", l: "AI Agents" }, { v: "88%+", l: "Confidence" }, { v: "100%", l: "Audit Trail" }], tech: ["Python", "LangGraph", "FastAPI", "Next.js 14", "NVIDIA NIM", "ChromaDB", "PostgreSQL", "Docker"], github: "https://github.com/Sachin2102/Nexus", demo: "https://youtu.be/25n4Kv7HWWQ" },
  { index: "02", name: "Kurnicus", category: "Kernel Security · Linux · IoT & Automotive", description: "Kernel-native security telemetry platform for IoT, embedded, and automotive environments. Traces syscalls with <3% CPU overhead, supports offline edge sync, and aligns with ISO 21434 and NIST CSF.", metrics: [{ v: "3%", l: "CPU Overhead" }, { v: "10+", l: "Modules" }, { v: "256MB", l: "Min RAM" }, { v: "0", l: "Config" }], tech: ["Bash", "Python", "Flask", "React", "AWS S3", "AWS EC2", "tshark", "inotify"], github: "https://github.com/Sachin2102/kurnicus", demo: null },
];

const TABS = ["Experience", "Certifications", "Education"] as const;
type Tab = typeof TABS[number];

/* ── logo element ─────────────────────────────────────────────── */
function LogoEl({ src, alt, abbr }: { src: string | null; alt: string; abbr?: string }) {
  if (src) return <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />;
  return <span style={{ fontWeight: 800, fontSize: "1.5rem", color: T.acc }}>{abbr}</span>;
}

/* ── sticky-stacking scroll hook ──────────────────────────────── */
function useStackScale(count: number, base: number, step: number) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const run = useCallback(() => {
    const vh = window.innerHeight;
    refs.current.forEach((el, i) => {
      if (!el) return;
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      const rect = el.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, ((base + i * step) - rect.top) / (vh * 0.6)));
      inner.style.transform = `scale(${1 - 0.08 * t})`;
      inner.style.transformOrigin = "top center";
    });
  }, [base, step]);
  useEffect(() => {
    refs.current = refs.current.slice(0, count);
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    run();
    return () => { window.removeEventListener("scroll", run); window.removeEventListener("resize", run); };
  }, [run, count]);
  return refs;
}

/* ── NAV ──────────────────────────────────────────────────────── */
function Nav() {
  const visitorLocation = useVisitorLocation();
  const [active, setActive] = useState("about");
  const links = [["about", "About"], ["journey", "Journey"], ["work", "Case Studies"], ["projects", "Projects"], ["contact", "Contact"]] as const;

  useEffect(() => {
    const sections = links.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      padding: "18px clamp(20px,4vw,40px)",
      background: `rgba(4,16,11,.7)`, backdropFilter: "blur(14px)",
      borderBottom: `1px solid rgba(${T.rgb},.14)`,
    }}>
      <span className="cin-logo" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, color: T.txt, flexShrink: 0 }}>Sachin<span style={{ color: T.acc }}>.</span></span>
      <div className="cin-navlinks cin-scrollx" style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2.1vw,30px)", font: "600 11px/1 'JetBrains Mono',monospace", letterSpacing: ".18em", textTransform: "uppercase", color: T.mut, flexWrap: "wrap" }}>
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            style={{ cursor: "pointer", textDecoration: "none", transition: "color .2s", color: active === id ? T.txt : T.mut, fontWeight: active === id ? 800 : 600, whiteSpace: "nowrap" }}>
            {label}
          </a>
        ))}
      </div>
      <div className="cin-navloc" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.acc, boxShadow: `0 0 8px 1px rgba(${T.rgb},.8)`, flexShrink: 0 }} />
        <span style={{ font: "700 10px/1 'JetBrains Mono',monospace", letterSpacing: ".15em", color: T.txt, whiteSpace: "nowrap" }}>{visitorLocation}</span>
      </div>
    </nav>
  );
}

/* ── HERO ─────────────────────────────────────────────────────── */
/* Renders HERO_HEADLINE as one flowing, word-wrapping line (not stacked
   one-pair-per-line). Words listed in HERO_HIGHLIGHT get the italic
   accent style; everything else renders plain. Add/remove words from
   either array freely — nothing needs to stay paired or in sequence. */
const HERO_HIGHLIGHT = ["Products", "Experiences", "Trust", "Impact."];

function buildHeroWords(words: string[], highlight: string[]): React.ReactNode[] {
  const accentStyle: React.CSSProperties = {
    fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400,
    background: `linear-gradient(100deg,${T.acc2},${T.acc})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
  };
  return words.map((w, i) => (
    <span key={i} style={{ display: "inline-block", marginRight: "0.32em" }}>
      {highlight.includes(w) ? <em style={accentStyle}>{w}</em> : w}
    </span>
  ));
}

function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleMesh(canvasRef, 66);
  return (
    <section style={{ position: "relative", display: "flex", flexDirection: "column", overflow: "hidden", background: `radial-gradient(130% 100% at 50% -6%, ${T.bg2} 0%, ${T.bg1} 46%, ${T.bg0} 100%)` }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 180, background: `linear-gradient(180deg,transparent,rgba(${T.rgb},.05),transparent)`, animation: "cin-scanDrift 7.5s linear infinite" }} />
      </div>

      <Nav />

      <div style={{ position: "relative", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "clamp(70px,11vh,130px) clamp(20px,4vw,40px) clamp(28px,4vh,44px)" }}>
        <h1 style={{
          margin: 0, fontWeight: 500, fontSize: "clamp(2rem,5.2vw,4.6rem)", lineHeight: 1.15,
          letterSpacing: "-.02em", color: T.txt, maxWidth: "34ch",
          opacity: 0, animation: "cin-fadeUp .9s cubic-bezier(.22,1,.36,1) .25s forwards",
        }}>
          {buildHeroWords(HERO_HEADLINE, HERO_HIGHLIGHT)}
        </h1>
      </div>

      <div style={{ position: "relative", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 clamp(20px,4vw,40px) clamp(56px,8vh,88px)" }}>
        <div style={{ position: "relative", width: 156, height: 156, opacity: 0, animation: "cin-fadeUp .9s cubic-bezier(.22,1,.36,1) .78s forwards" }}>
          {/* stacked depth rings behind the avatar */}
          <div style={{ position: "absolute", inset: -28, borderRadius: "50%", border: `1px solid rgba(${T.rgb},.12)` }} />
          <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: `1px solid rgba(${T.rgb},.2)` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: `2px solid ${T.acc}`, boxShadow: `0 0 50px rgba(${T.rgb},.35)` }}>
            <img src="/avatar.jpg" alt={HERO_NAME} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginTop: 20,
          opacity: 0, animation: "cin-fadeUp .9s cubic-bezier(.22,1,.36,1) .9s forwards",
        }}>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2rem,4vw,3rem)", color: T.txt }}>{HERO_NAME}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.acc} strokeWidth={2.2}><path d="M12 2l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V5l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, background: "radial-gradient(120% 90% at 50% 40%,transparent 42%,rgba(0,0,0,.6) 100%)" }} />
      <div className="cin-grain" />
    </section>
  );
}

/* ── SKILLS MARQUEE ───────────────────────────────────────────── */
function SkillsMarquee() {
  const row1 = [...skills1, ...skills1];
  const row2 = [...skills2, ...skills2];
  return (
    <section style={{ position: "relative", zIndex: 5, background: T.bg1, borderRadius: "32px 32px 0 0", marginTop: -32, padding: "56px 0 64px" }}>
      <p style={{ textAlign: "center", font: "700 15px/1.4 'JetBrains Mono',monospace", letterSpacing: ".22em", textTransform: "uppercase", color: T.acc, margin: "0 0 36px" }}>Capabilities · Full Stack of Product &amp; Security</p>
      <div className="cin-mrow" style={{ overflow: "hidden", width: "100%", marginBottom: 30 }}>
        <div style={{ display: "flex", gap: 12, width: "max-content", animation: "cin-marq 34s linear infinite" }}>
          {row1.map((s, i) => (
            <span key={i} style={{ flexShrink: 0, padding: "11px 22px", borderRadius: 99, border: `1px solid rgba(${T.rgb},.2)`, background: `rgba(${T.rgb},.06)`, font: "600 12px/1 'Hanken Grotesk'", letterSpacing: ".08em", textTransform: "uppercase", color: T.txt, whiteSpace: "nowrap" }}>{s}</span>
          ))}
        </div>
      </div>
      <div className="cin-mrow" style={{ overflow: "hidden", width: "100%" }}>
        <div style={{ display: "flex", gap: 12, width: "max-content", animation: "cin-marqR 30s linear infinite" }}>
          {row2.map((s, i) => (
            <span key={i} style={{ flexShrink: 0, padding: "11px 22px", borderRadius: 99, border: `1px solid rgba(${T.rgb},.16)`, background: `rgba(${T.rgb},.04)`, font: "600 12px/1 'Hanken Grotesk'", letterSpacing: ".08em", textTransform: "uppercase", color: T.mut, whiteSpace: "nowrap" }}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ────────────────────────────────────────────────────── */
function About() {
  const bioRef = useRef<HTMLParagraphElement>(null);
  const words = BIO.split(" ");
  useEffect(() => {
    const handler = () => {
      const el = bioRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const start = vh * 0.85, end = vh * 0.35;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const spans = el.querySelectorAll<HTMLSpanElement>("[data-w]");
      const n = spans.length;
      spans.forEach((w, i) => {
        const wp = Math.max(0, Math.min(1, (p - i / n) / (1 / n)));
        w.style.opacity = (0.16 + wp * 0.84).toFixed(2);
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section id="about" style={{ position: "relative", zIndex: 6, background: T.bg0, borderRadius: "32px 32px 0 0", marginTop: -32, padding: "clamp(48px,7vh,80px) clamp(20px,5vw,40px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 520, height: 520, top: "-10%", right: "-10%", borderRadius: "50%", background: `radial-gradient(circle,rgba(${T.rgb},.12),transparent 68%)`, pointerEvents: "none" }} />
      <Reveal>
        <h2 style={{ position: "relative", margin: "0 0 26px", fontWeight: 800, fontSize: "clamp(3rem,11vw,9rem)", lineHeight: 0.9, letterSpacing: "-.03em", textTransform: "uppercase", background: `linear-gradient(120deg,${T.acc2},${T.acc})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>About me</h2>
      </Reveal>
      <p ref={bioRef} style={{ position: "relative", maxWidth: 640, font: "500 clamp(1.05rem,2vw,1.5rem)/1.6 'Hanken Grotesk'", color: T.txt, margin: "0 0 36px" }}>
        {words.map((w, i) => <span key={i} data-w style={{ opacity: 0.16 }}>{w} </span>)}
      </p>
      <Reveal>
        <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
          className="cin-cta"
          style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 12, font: "700 16px/1 'JetBrains Mono',monospace", letterSpacing: ".14em", textTransform: "uppercase", color: T.bg0, background: `linear-gradient(120deg,${T.acc},${T.acc2})`, padding: "22px 42px", borderRadius: 99, textDecoration: "none", boxShadow: `0 12px 30px rgba(${T.rgb},.3)`, transition: "transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease" }}>
          Get in touch <span style={{ display: "inline-block", animation: "cin-arrow 1.8s ease-in-out infinite" }}>→</span>
        </a>
      </Reveal>
    </section>
  );
}

/* ── tab icons ────────────────────────────────────────────────── */
const TAB_ICON: Record<Tab, React.ReactNode> = {
  Experience: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Certifications: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Education: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  ),
};

/* ── docked pill switcher — sits below the heading at rest ──────── */
function DockedTabSwitcher({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, padding: "0 20px" }}>
      <div className="cin-dockpill cin-scrollx" style={{
        display: "flex", gap: 4, padding: 8, borderRadius: 20,
        background: `linear-gradient(135deg, rgba(${T.rgb},.14), rgba(4,16,11,.5))`,
        backdropFilter: "blur(16px)", border: `1px solid rgba(${T.rgb},.28)`,
        boxShadow: `0 20px 50px rgba(0,0,0,.4), 0 0 0 1px rgba(${T.rgb},.06) inset`,
        maxWidth: "100%", overflowX: "auto",
      }}>
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              display: "flex", alignItems: "center", gap: 10, flexShrink: 0, whiteSpace: "nowrap",
              padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer",
              font: "700 13px/1 'JetBrains Mono',monospace", letterSpacing: ".06em",
              background: active ? `linear-gradient(135deg,${T.acc},${T.acc2})` : "transparent",
              color: active ? T.bg0 : T.mut,
              boxShadow: active ? `0 8px 22px rgba(${T.rgb},.45)` : "none",
              transform: active ? "scale(1.04)" : "scale(1)",
              transition: "all .3s cubic-bezier(.22,1,.36,1)",
            }}>
              {TAB_ICON[t]}
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── floating drawer tab switcher — slides out from the left edge on desktop,
     collapses to a compact icon bar pinned to the bottom on mobile so it
     never overlaps card content (see .cin-floatswitch media query) ────── */
function FloatingTabSwitcher({ tab, setTab, visible }: { tab: Tab; setTab: (t: Tab) => void; visible: boolean }) {
  return (
    <div className="cin-floatswitch" style={{
      position: "fixed", left: 0, top: "50%", zIndex: 45,
      transform: "translateY(-50%)",
      maxWidth: visible ? 220 : 0,
      opacity: visible ? 1 : 0,
      overflow: "hidden",
      pointerEvents: visible ? "auto" : "none",
      transition: visible
        ? "max-width .5s cubic-bezier(.22,1,.36,1) .05s, opacity .3s ease .05s"
        : "max-width .4s cubic-bezier(.5,0,.2,1) 0s, opacity .2s ease 0s",
      animation: visible ? "cin-tabFloat 5s ease-in-out infinite" : "none",
    }}>
      <div className="cin-floatswitch-inner" style={{
        display: "flex", flexDirection: "column", gap: 6, width: 210,
        background: `linear-gradient(160deg, rgba(${T.rgb},.16), rgba(4,16,11,.6))`,
        backdropFilter: "blur(20px)", borderRadius: "0 20px 20px 0",
        borderTop: `1px solid rgba(${T.rgb},.28)`, borderRight: `1px solid rgba(${T.rgb},.28)`, borderBottom: `1px solid rgba(${T.rgb},.28)`,
        padding: "10px 10px 10px 16px", marginLeft: -1,
        boxShadow: `0 24px 60px rgba(0,0,0,.5), 0 0 40px rgba(${T.rgb},.1)`,
      }}>
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} title={t} style={{
              position: "relative", display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", borderRadius: 14, border: "none", cursor: "pointer",
              font: "700 12px/1 'JetBrains Mono',monospace", letterSpacing: ".05em",
              background: active ? `linear-gradient(135deg,${T.acc}22,${T.acc2}11)` : "transparent",
              color: active ? T.txt : T.mut,
              transform: active ? "scale(1.06)" : "scale(1)",
              transition: "all .3s cubic-bezier(.22,1,.36,1)",
              whiteSpace: "nowrap",
            }}>
              <span style={{
                display: "flex", color: active ? T.acc : "inherit",
                filter: active ? `drop-shadow(0 0 6px rgba(${T.rgb},.8))` : "none",
              }}>{TAB_ICON[t]}</span>
              <span className="cin-tabswitch-label">{t}</span>
              <span className="cin-tabswitch-indicator" style={{
                position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)",
                width: 3, height: active ? "60%" : "0%", borderRadius: 99,
                background: T.acc, boxShadow: active ? `0 0 10px rgba(${T.rgb},.8)` : "none",
                transition: "height .3s ease",
              }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── JOURNEY ──────────────────────────────────────────────────── */
function Journey() {
  const [tab, setTab] = useState<Tab>("Experience");
  const items = tab === "Experience" ? experience : tab === "Certifications" ? certs : edu;
  const refs = useStackScale(items.length, 110, 20);

  const sectionRef = useRef<HTMLElement>(null);
  const dockedRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(false);
  useEffect(() => {
    const check = () => {
      const section = sectionRef.current, pill = dockedRef.current;
      if (!section || !pill) return;
      const sectionRect = section.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();
      // Only float once the docked pill has scrolled above the fixed nav (~90px),
      // and only while the Journey section itself still occupies real screen space
      // below that point — so it never leaks into Hero/About or Case Studies.
      const pillScrolledAbove = pillRect.bottom < 90;
      const sectionStillOnScreen = sectionRect.top < window.innerHeight - 160 && sectionRect.bottom > 200;
      setFloating(pillScrolledAbove && sectionStillOnScreen);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);

  return (
    <section ref={sectionRef} id="journey" style={{ position: "relative", zIndex: 7, background: T.bg1, borderRadius: "32px 32px 0 0", marginTop: -32, padding: "clamp(40px,6vh,72px) 0 28px", overflow: "visible" }}>
      <FloatingTabSwitcher tab={tab} setTab={setTab} visible={floating} />
      {/*<Reveal><p style={{ textAlign: "center", font: "600 11px/1 'JetBrains Mono',monospace", letterSpacing: ".28em", textTransform: "uppercase", color: T.mut, margin: "0 0 12px" }}>Eight Years · One Through-Line</p></Reveal>*/}
      <Reveal><h2 style={{ textAlign: "center", margin: "0 0 24px", fontWeight: 800, fontSize: "clamp(2.8rem,11vw,9rem)", lineHeight: 0.88, letterSpacing: "-.03em", textTransform: "uppercase", background: `linear-gradient(120deg,${T.acc2},${T.acc})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Journey</h2></Reveal>

      <div ref={dockedRef}>
        <DockedTabSwitcher tab={tab} setTab={setTab} />
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)" }}>
        {items.map((item, i) => (
          <div key={item.num} ref={(el) => { refs.current[i] = el; }} style={{ position: "sticky", top: 110 + i * 20, zIndex: i + 1, marginBottom: 20 }}>
            <div style={{ willChange: "transform" }}>
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, background: `linear-gradient(150deg,${T.bg2},${T.bg0})`, border: `1px solid rgba(${T.rgb},.14)`, padding: "clamp(22px,3vw,34px)", boxShadow: "0 20px 50px rgba(0,0,0,.4)" }}>
                <span style={{ position: "absolute", top: 16, right: 28, font: "700 10px/1 'JetBrains Mono',monospace", letterSpacing: ".2em", color: `rgba(${T.rgb},.4)` }}>{item.num}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.5vw,26px)", flexWrap: "wrap" }}>
                  <div style={{ width: 156, height: 156, flexShrink: 0, borderRadius: 20, background: item.logoBg || "transparent", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 12 }}>
                    <LogoEl src={item.logo} alt={item.name} abbr={item.abbr} />
                  </div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                      <span style={{ font: "600 12px/1 'JetBrains Mono',monospace", letterSpacing: ".14em", textTransform: "uppercase", color: T.acc, border: `1px solid rgba(${T.rgb},.35)`, padding: "5px 12px", borderRadius: 99 }}>{item.badge}</span>
                      <span style={{ font: "400 12px/1 'JetBrains Mono',monospace", letterSpacing: ".06em", color: T.mut }}>{item.dates}</span>
                      <span style={{ font: "400 12px/1 'JetBrains Mono',monospace", color: T.mut }}>{item.location}</span>
                    </div>
                    <h3 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "clamp(1.25rem,2.6vw,1.8rem)", lineHeight: 1.05, textTransform: "uppercase", color: T.txt }}>{item.name}</h3>
                    <p style={{ margin: "0 0 16px", font: "700 14px/1.4 'JetBrains Mono',monospace", letterSpacing: ".06em", textTransform: "uppercase", color: T.acc }}>{item.role}</p>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: item.points.length ? 16 : 0 }}>
                      {item.tags.map((tg) => <span key={tg} style={{ font: "600 11px/1 'JetBrains Mono',monospace", letterSpacing: ".06em", textTransform: "uppercase", border: `1px solid rgba(${T.rgb},.25)`, color: T.mut, padding: "5px 11px", borderRadius: 99, background: `rgba(${T.rgb},.05)` }}>{tg}</span>)}
                    </div>
                    {item.points.length > 0 && (
                      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                        {item.points.map((pt, j) => (
                          <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ width: 6, height: 6, flexShrink: 0, marginTop: 6, background: T.acc, transform: "rotate(45deg)", boxShadow: `0 0 8px rgba(${T.rgb},.7)` }} />
                            <span style={{ font: "400 .88rem/1.5 'Hanken Grotesk'", color: T.mut }}>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ height: "20vh" }} />
      </div>
    </section>
  );
}

/* ── CASE STUDIES ─────────────────────────────────────────────── */
function CaseStudies() {
  return (
    <section id="work" style={{ position: "relative", zIndex: 8, background: T.bg1, borderRadius: "32px 32px 0 0", marginTop: -32, padding: "clamp(40px,6vh,72px) clamp(20px,4vw,40px)" }}>
      <Reveal><h2 style={{ textAlign: "center", margin: "0 0 clamp(28px,4vw,48px)", fontWeight: 800, fontSize: "clamp(2.6rem,10vw,8rem)", lineHeight: 0.9, letterSpacing: "-.03em", textTransform: "uppercase", background: `linear-gradient(120deg,${T.acc2},${T.acc})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Case Studies</h2></Reveal>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,420px),1fr))", gap: 26 }}>
        {caseStudies.map((cs) => (
          <Reveal key={cs.num}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, padding: "30px 32px", background: `linear-gradient(150deg,${T.bg2},${T.bg0})`, border: `1px solid rgba(${T.rgb},.16)`, minHeight: 300, display: "flex", flexDirection: "column" }}>
              <span style={{ position: "absolute", top: 8, right: 24, fontWeight: 800, fontSize: 130, lineHeight: 1, color: `rgba(${T.rgb},.08)`, pointerEvents: "none" }}>{cs.num}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 22 }}>
                <div style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={cs.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <p style={{ margin: 0, font: "700 13px/1.5 'JetBrains Mono',monospace", letterSpacing: ".14em", textTransform: "uppercase", color: T.acc }}>{cs.eyebrow}</p>
              </div>
              <h3 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2rem)", lineHeight: 1.05, textTransform: "uppercase", color: T.txt }}>{cs.title}</h3>
              <p style={{ margin: "0 0 20px", font: "400 .92rem/1.65 'Hanken Grotesk'", color: T.mut, maxWidth: "44ch" }}>{cs.body}</p>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {cs.chips.length > 0 ? (
                  <>
                    {cs.chips.map((ch) => (
                      <div key={ch.v} style={{ background: `rgba(${T.rgb},.1)`, border: `1px solid rgba(${T.rgb},.3)`, borderRadius: 14, padding: "12px 18px", textAlign: "center" }}>
                        <div style={{ fontWeight: 800, fontSize: 20, color: T.acc2, lineHeight: 1.15 }}>{ch.k}</div>
                        <div style={{ font: "600 10px/1 'JetBrains Mono',monospace", letterSpacing: ".1em", textTransform: "uppercase", color: T.mut, marginTop: 5 }}>{ch.v}</div>
                      </div>
                    ))}
                    {cs.href ? (
                      <a href={cs.href} style={{ marginLeft: "auto", font: "700 13px/1 'JetBrains Mono',monospace", letterSpacing: ".1em", textTransform: "uppercase", color: T.bg0, background: `linear-gradient(90deg,${T.acc},${T.acc2})`, padding: "15px 26px", borderRadius: 99, whiteSpace: "nowrap", textDecoration: "none" }}>{cs.cta} →</a>
                    ) : (
                      <span style={{ marginLeft: "auto", font: "700 13px/1 'JetBrains Mono',monospace", letterSpacing: ".1em", textTransform: "uppercase", color: T.bg0, background: `linear-gradient(90deg,${T.acc},${T.acc2})`, padding: "15px 26px", borderRadius: 99, whiteSpace: "nowrap" }}>{cs.cta} →</span>
                    )}
                  </>
                ) : (
                  <span style={{ font: "700 12px/1 'JetBrains Mono',monospace", letterSpacing: ".16em", textTransform: "uppercase", color: T.acc, background: `rgba(${T.rgb},.1)`, border: `1px solid rgba(${T.rgb},.3)`, padding: "12px 26px", borderRadius: 99 }}>{cs.cta}</span>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── PROJECTS ─────────────────────────────────────────────────── */
function Projects() {
  const refs = useStackScale(projects.length, 110, 22);
  return (
    <section id="projects" style={{ position: "relative", zIndex: 9, background: T.bg0, borderRadius: "32px 32px 0 0", marginTop: -32, padding: "clamp(40px,6vh,72px) clamp(20px,4vw,40px) 28px", overflow: "visible" }}>
      <Reveal><p style={{ textAlign: "center", font: "600 11px/1 'JetBrains Mono',monospace", letterSpacing: ".28em", textTransform: "uppercase", color: T.mut, margin: "0 0 10px" }}>Built From Scratch</p></Reveal>
      <Reveal><h2 style={{ textAlign: "center", margin: "0 0 30px", fontWeight: 800, fontSize: "clamp(2.8rem,11vw,9rem)", lineHeight: 0.88, letterSpacing: "-.03em", textTransform: "uppercase", background: `linear-gradient(120deg,${T.acc2},${T.acc})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Projects</h2></Reveal>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        {projects.map((p, i) => (
          <div key={p.index} ref={(el) => { refs.current[i] = el; }} style={{ position: "sticky", top: 110 + i * 22, zIndex: i + 1, marginBottom: 22 }}>
            <div style={{ willChange: "transform" }}>
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 30, background: `linear-gradient(150deg,${T.bg2},${T.bg0})`, border: `1px solid rgba(${T.rgb},.16)`, padding: "clamp(28px,4vw,44px)", minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 24px 60px rgba(0,0,0,.45)" }}>
                <span style={{ position: "absolute", bottom: -70, right: -10, fontWeight: 800, fontSize: "clamp(12rem,26vw,22rem)", lineHeight: 1, color: `rgba(${T.rgb},.05)`, pointerEvents: "none" }}>{p.index}</span>
                <div style={{ position: "relative" }}>
                  <p style={{ margin: "0 0 10px", font: "700 13px/1.5 'JetBrains Mono',monospace", letterSpacing: ".16em", textTransform: "uppercase", color: T.acc }}>{p.category}</p>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(2.4rem,6vw,4rem)", letterSpacing: "-.03em", textTransform: "uppercase", background: `linear-gradient(120deg,${T.acc2},${T.acc})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.name}</h3>
                </div>
                <p style={{ position: "relative", margin: "20px 0", font: "400 1.05rem/1.75 'Hanken Grotesk'", color: T.mut, maxWidth: "58ch" }}>{p.description}</p>
                <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
                  {p.metrics.map((m) => (
                    <div key={m.l} style={{ padding: "13px 20px", borderRadius: 16, background: `rgba(${T.rgb},.1)`, border: `1px solid rgba(${T.rgb},.3)`, textAlign: "center", minWidth: 88 }}>
                      <div style={{ fontWeight: 800, fontSize: "1.4rem", color: T.acc2, lineHeight: 1.15 }}>{m.v}</div>
                      <div style={{ font: "600 10px/1 'JetBrains Mono',monospace", letterSpacing: ".1em", textTransform: "uppercase", color: T.mut, marginTop: 5 }}>{m.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ position: "relative", borderTop: `1px solid rgba(${T.rgb},.12)`, paddingTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a href={p.github} target="_blank" rel="noopener" style={{ font: "700 13px/1 'JetBrains Mono',monospace", letterSpacing: ".08em", textTransform: "uppercase", color: T.bg0, background: `linear-gradient(90deg,${T.acc},${T.acc2})`, padding: "14px 26px", borderRadius: 99, textDecoration: "none" }}>GitHub →</a>
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener" style={{ font: "700 13px/1 'JetBrains Mono',monospace", letterSpacing: ".08em", textTransform: "uppercase", color: T.mut, background: `rgba(${T.rgb},.06)`, border: `1px solid rgba(${T.rgb},.2)`, padding: "14px 26px", borderRadius: 99, textDecoration: "none" }}>▶ Demo</a>}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.tech.map((tc) => <span key={tc} style={{ font: "500 11px/1 'JetBrains Mono',monospace", letterSpacing: ".04em", background: `rgba(${T.rgb},.08)`, color: T.mut, border: `1px solid rgba(${T.rgb},.18)`, padding: "6px 13px", borderRadius: 99 }}>{tc}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ height: "16vh" }} />
      </div>
    </section>
  );
}

/* ── contact picker — replaces raw mailto: to avoid the OS app-open prompt ── */
function ContactPicker() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(FOOTER_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable — no-op */ }
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: "clamp(2rem,5vw,3.6rem)",
          color: T.txt, background: "none", border: "none", cursor: "pointer", padding: 0,
          borderBottom: `2px solid rgba(${T.rgb},.4)`, paddingBottom: ".08em",
        }}
      >
        get in touch <span style={{ display: "inline-block", animation: "cin-arrow 1.8s ease-in-out infinite", color: T.acc }}>→</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 14px)", left: 0, zIndex: 20,
          display: "flex", flexDirection: "column", gap: 6, minWidth: 260,
          background: T.bg2, border: `1px solid rgba(${T.rgb},.3)`, borderRadius: 16,
          padding: 10, boxShadow: "0 24px 60px rgba(0,0,0,.5)",
        }}>
          <a href={FOOTER_LINKEDIN} target="_blank" rel="noopener"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, textDecoration: "none", color: T.txt, font: "600 0.95rem/1 'Hanken Grotesk'" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${T.rgb},.12)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ color: T.acc }}>in</span> Connect on LinkedIn
          </a>
          <button onClick={copyEmail}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", color: T.txt, font: "600 0.95rem/1 'Hanken Grotesk'", textAlign: "left" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${T.rgb},.12)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ color: T.acc }}>✉</span> {copied ? "Copied to clipboard!" : `Copy ${FOOTER_EMAIL}`}
          </button>
        </div>
      )}
    </div>
  );
}

function CopyEmailLink() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FOOTER_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable — no-op */ }
  };
  return (
    <button onClick={copy} style={{ color: copied ? T.acc : T.mut, textDecoration: "none", background: "none", border: "none", cursor: "pointer", font: "inherit", padding: 0 }}>
      {copied ? "Copied!" : "Email"}
    </button>
  );
}

/* ── FOOTER ───────────────────────────────────────────────────── */
function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleMesh(canvasRef, 40);
  return (
    <footer id="contact" style={{ position: "relative", zIndex: 10, background: "#020906", borderRadius: "32px 32px 0 0", marginTop: -32, padding: "clamp(48px,7vh,80px) clamp(20px,4vw,40px)", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-25%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(${T.rgb},.16),transparent 68%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontWeight: 300, fontSize: "clamp(1.6rem,3.8vw,3rem)", lineHeight: 1.35, color: T.txt, margin: "0 0 28px" }}>
            {FOOTER_LINE_1} <em style={{ fontStyle: "italic", fontWeight: 500, background: `linear-gradient(120deg,${T.acc},${T.acc2})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{FOOTER_LINE_1_ACCENT}</em>, {FOOTER_LINE_2} <em style={{ fontStyle: "italic", fontWeight: 500, background: `linear-gradient(120deg,${T.acc},${T.acc2})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{FOOTER_LINE_2_ACCENT}</em>, {FOOTER_LINE_3}
          </p>
        </Reveal>
        <Reveal><ContactPicker /></Reveal>
        <div style={{ height: 1, background: `rgba(${T.rgb},.12)`, margin: "clamp(1.8rem,4vw,2.6rem) 0 1.2rem" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <p style={{ margin: 0, font: "400 10px/1 'JetBrains Mono',monospace", letterSpacing: ".16em", textTransform: "uppercase", color: T.mut }}>{FOOTER_SIGNOFF}</p>
          <div style={{ display: "flex", gap: 18, font: "600 10px/1 'JetBrains Mono',monospace", letterSpacing: ".14em", textTransform: "uppercase", color: T.mut }}>
            <a href={FOOTER_LINKEDIN} target="_blank" rel="noopener" style={{ color: T.mut, textDecoration: "none" }}>LinkedIn</a>
            <a href={FOOTER_GITHUB} target="_blank" rel="noopener" style={{ color: T.mut, textDecoration: "none" }}>GitHub</a>
            <CopyEmailLink />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── ROOT ─────────────────────────────────────────────────────── */
export default function CinematicPortfolio() {
  return (
    <div id="cinema" style={{ position: "relative", width: "100%", overflow: "clip", background: T.bg0, color: T.txt }}>
      <GlobalStyles />
      <CursorGlow />
      <Hero />
      <SkillsMarquee />
      <About />
      <Journey />
      <CaseStudies />
      <Projects />
      <Footer />
    </div>
  );
}
