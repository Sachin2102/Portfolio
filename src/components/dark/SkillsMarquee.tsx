import React from "react";

const row1 = [
  "Product Strategy", "Security Architecture", "Roadmap Planning", "User Research",
  "Agile / Scrum", "Threat Modeling", "Data Analysis", "Stakeholder Management",
  "Digital Forensics", "Go-to-Market", "A/B Testing", "OKR Frameworks",
];
const row2 = [
  "Ethical Hacking", "Enterprise SaaS", "SQL & Python",
  "JIRA & Confluence", "Design Thinking", "AI Product Ops",
  "Cybersecurity PM", "Cross-functional Leadership", "Penetration Testing", "Sprint Facilitation",
];

const Chip = ({ text }: { text: string }) => (
  <div
    className="flex-shrink-0 px-6 py-3 rounded-full border font-medium uppercase tracking-wider whitespace-nowrap text-sm"
    style={{ borderColor: "rgba(13,148,136,0.2)", color: "#1A5C4A", background: "rgba(13,148,136,0.06)" }}
  >
    {text}
  </div>
);

const MarqueeRow = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          width: "max-content",
          animation: `marquee${reverse ? "Reverse" : ""} 32s linear infinite`,
        }}
      >
        {doubled.map((t, i) => <Chip key={i} text={t} />)}
      </div>
    </div>
  );
};

export default function SkillsMarquee() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .marquee-row:hover > div { animation-play-state: paused; }
      `}</style>
      <div
        className="pt-20 pb-10"
        style={{ background: "#FFFFFF", borderRadius: "40px 40px 0 0", marginTop: -40, position: "relative", zIndex: 2 }}
      >
        <div className="marquee-row mb-3">
          <MarqueeRow items={row1} />
        </div>
        <div className="marquee-row">
          <MarqueeRow items={row2} reverse />
        </div>
      </div>
    </>
  );
}
