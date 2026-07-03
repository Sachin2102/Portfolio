import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { Mail } from "lucide-react";

export default function DarkFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type P = { x: number; y: number; vx: number; vy: number; o: number; r: number };
    const particles: P[] = [];
    const init = () => {
      particles.length = 0;
      for (let i = 0; i < 55; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          o: 0.15 + Math.random() * 0.35,
          r: 1 + Math.random() * 1.5,
        });
      }
    };
    init();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(13,148,136,${(1 - dist / 110) * 0.10})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,148,136,${p.o})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <footer
      id="contact"
      className="relative px-6 md:px-10 py-12 md:py-16 overflow-hidden"
      style={{ background: "#060F0B", borderRadius: "40px 40px 0 0", marginTop: -2 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(13,148,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px", zIndex: 0,
      }} />

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <motion.div style={{
          position: "absolute", width: 700, height: 500, borderRadius: "50%",
          bottom: "-20%", left: "50%", transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(13,148,136,0.18) 0%, rgba(22,163,74,0.06) 45%, transparent 70%)",
        }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          top: "10%", right: "-5%",
          background: "radial-gradient(circle, rgba(101,163,13,0.10) 0%, transparent 65%)",
        }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          top: "15%", left: "-3%",
          background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 65%)",
        }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, rgba(13,148,136,0.3) 30%, rgba(101,163,13,0.3) 70%, transparent)",
        zIndex: 1,
      }} />

      <div className="max-w-3xl mx-auto relative z-10" style={{ padding: "0 0.5rem" }}>
        <motion.p
          style={{
            fontSize: "clamp(1.6rem, 3.8vw, 3rem)",
            fontWeight: 300,
            lineHeight: 1.35,
            color: "rgba(238,246,241,0.88)",
            letterSpacing: "-0.01em",
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
          }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Whether you need a{" "}
          <em style={{
            fontStyle: "italic", fontWeight: 500,
            background: "linear-gradient(135deg, #0D9488, #2DD4BF)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>PM who builds</em>
          , want to discuss{" "}
          <em style={{
            fontStyle: "italic", fontWeight: 500,
            background: "linear-gradient(135deg, #16A34A, #4ADE80)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>AI systems</em>
          , or just want to say hi —
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="mailto:sachin.rai2113@gmail.com"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontStyle: "italic", fontWeight: 600,
              color: "#EEF6F1",
              textDecoration: "none",
              borderBottom: "2px solid rgba(13,148,136,0.4)",
              paddingBottom: "0.1em",
              transition: "color 0.25s ease, border-color 0.25s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#0D9488";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0D9488";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#EEF6F1";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(13,148,136,0.4)";
            }}
          >
            get in touch
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >→</motion.span>
          </a>
        </motion.div>

        <motion.div
          style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div style={{ height: 1, background: "rgba(13,148,136,0.12)", marginBottom: "1.4rem" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#3E5A4E" }}>
              Sachin Rai · Cybersecurity PM · {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/sachin-rai21/" target="_blank" rel="noopener noreferrer"
                className="transition-all duration-200 hover:opacity-70 hover:scale-110" style={{ color: "#5A7A6E" }}>
                <FaLinkedin size={18} />
              </a>
              <a href="https://github.com/Sachin2102" target="_blank" rel="noopener noreferrer"
                className="transition-all duration-200 hover:opacity-70 hover:scale-110" style={{ color: "#5A7A6E" }}>
                <FaGithub size={18} />
              </a>
              <a href="mailto:sachin.rai2113@gmail.com"
                className="transition-all duration-200 hover:opacity-70 hover:scale-110" style={{ color: "#5A7A6E" }}>
                <Mail size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
