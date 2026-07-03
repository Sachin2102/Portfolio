import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BIO = "0-1 builder at the intersection of cybersecurity and AI, whether shipping inside an enterprise platform or building from scratch on my own. I turn ambiguous problems into shipped product by pairing technical depth with product instinct, partnering across engineering, security, and leadership to build things that are trusted, not just functional.";

function AnimatedBio({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.3;
      const p = (start - rect.top) / (start - (rect.top - rect.height + end));
      setProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const words = text.split(" ");
  const total = words.length;

  return (
    <div ref={ref} className="text-center" style={{ maxWidth: 600 }}>
      <p className="font-medium leading-relaxed" style={{ color: "#0B1A14", fontSize: "clamp(1rem, 1.8vw, 1.3rem)" }}>
        {words.map((word, i) => {
          const threshold = i / total;
          const wordProgress = Math.max(0, Math.min(1, (progress - threshold) / (1 / total)));
          return (
            <span
              key={i}
              style={{
                opacity: 0.15 + wordProgress * 0.85,
                transition: "opacity 0.1s linear",
                display: "inline",
              }}
            >
              {word}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [-20, 60]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen flex flex-col items-center justify-center relative px-5 sm:px-8 py-20"
      style={{ background: "#EEF6F1", overflow: "hidden", borderRadius: "40px 40px 0 0", marginTop: -40, zIndex: 3 }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(rgba(11,42,36,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        zIndex: 0,
      }} />

      {/* Parallax orbs */}
      <motion.div className="absolute pointer-events-none" style={{
        width: 600, height: 600, borderRadius: "50%",
        top: "-10%", right: "-12%", y: orb1Y, zIndex: 0,
        background: "radial-gradient(circle, rgba(13,148,136,0.13) 0%, rgba(22,163,74,0.06) 45%, transparent 70%)",
      }} />
      <motion.div className="absolute pointer-events-none" style={{
        width: 450, height: 450, borderRadius: "50%",
        bottom: "-8%", left: "-10%", y: orb2Y, zIndex: 0,
        background: "radial-gradient(circle, rgba(101,163,13,0.10) 0%, rgba(13,148,136,0.04) 55%, transparent 72%)",
      }} />
      <motion.div className="absolute pointer-events-none" style={{
        width: 280, height: 280, borderRadius: "50%",
        top: "40%", left: "5%", y: orb3Y, zIndex: 0,
        background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 68%)",
      }} />

      {/* Floating animated accent orbs */}
      <motion.div className="absolute pointer-events-none" style={{
        width: 180, height: 180, borderRadius: "50%",
        top: "12%", left: "15%", zIndex: 0,
        background: "radial-gradient(circle, rgba(22,163,74,0.10) 0%, transparent 65%)",
      }}
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute pointer-events-none" style={{
        width: 120, height: 120, borderRadius: "50%",
        bottom: "18%", right: "12%", zIndex: 0,
        background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 65%)",
      }}
        animate={{ y: [0, 14, 0], x: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Thin accent line */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(13,148,136,0.08) 20%, rgba(13,148,136,0.08) 80%, transparent)",
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16">
        <motion.h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: "clamp(3rem, 12vw, 11rem)" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          About me
        </motion.h2>

        <AnimatedBio text={BIO} />

        <motion.div
          className="flex flex-wrap justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[["8+", "Years in Security"], ["$6M+", "ARR Protected"], ["60+", "Forensic Cases"], ["2", "Scrum Certs"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-black text-3xl sm:text-4xl hero-heading">{val}</div>
              <div className="text-xs uppercase tracking-widest mt-1 font-medium" style={{ color: "#3E5A4E" }}>{label}</div>
            </div>
          ))}
        </motion.div>

        <motion.button
          className="contact-btn px-10 py-3.5 text-sm"
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Get In Touch
        </motion.button>
      </div>
    </section>
  );
}
