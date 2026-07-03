import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import ExperienceSection from "@/components/dark/ExperienceSection";

function JourneyHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} style={{ overflow: "hidden", display: "inline-block" }}>
      <div style={{
        display: "inline-flex",
        background: "linear-gradient(135deg, #0D9488 0%, #16A34A 50%, #65A30D 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {"THE JOURNEY".split("").map((char, i) => (
          <motion.span
            key={i}
            style={{
              fontFamily: "'Kanit',sans-serif", fontWeight: 900,
              textTransform: "uppercase", display: "inline-block",
              fontSize: "clamp(3.5rem,13vw,12rem)", lineHeight: 0.9,
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ duration: 0.72, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      style={{ background: "#D6EEE4", position: "relative", borderRadius: "40px 40px 0 0", marginTop: -40, zIndex: 5 }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <motion.div
          style={{
            position: "absolute", inset: "-40px", y: gridY,
            backgroundImage: "radial-gradient(rgba(11,42,36,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <motion.div
          style={{ position: "absolute", top: "-5%", right: "10%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.09) 0%, transparent 65%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ position: "absolute", bottom: "8%", left: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(101,163,13,0.07) 0%, transparent 65%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, paddingTop: "clamp(3.5rem,6vw,5.5rem)", paddingBottom: "clamp(2rem,4vw,3rem)", textAlign: "center", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <motion.p
          style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#5A7A6E", marginBottom: "1.2rem" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Eight Years · One Through-Line
        </motion.p>

        <JourneyHeading />

        <motion.div
          style={{
            height: 3, borderRadius: 9999, maxWidth: 220, margin: "14px auto 0",
            background: "linear-gradient(90deg, #0D9488, #16A34A, #65A30D)",
            transformOrigin: "center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />

      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <ExperienceSection />
      </div>

      <div style={{ height: "clamp(2.5rem,5vw,4rem)" }} />
    </section>
  );
}
