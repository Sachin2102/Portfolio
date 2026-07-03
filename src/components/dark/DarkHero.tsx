import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const FI = ({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) => (
  <motion.div initial={{ opacity: 0, y }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}>
    {children}
  </motion.div>
);

export default function DarkHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    type Dot = { x: number; y: number; vx: number; vy: number; o: number; r: number };
    const dots: Dot[] = [];
    for (let i = 0; i < 70; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        o: 0.2 + Math.random() * 0.55,
        r: 1.2 + Math.random() * 1.2,
      });
    }

    const MAX_DIST = 130;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(13,148,136,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      dots.forEach((d) => {
        const dx = d.x - mx;
        const dy = d.y - my;
        const mdist = Math.sqrt(dx * dx + dy * dy);
        const boost = mdist < 160 ? (1 - mdist / 160) * 0.45 : 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,148,136,${Math.min(1, d.o + boost)})`;
        ctx.fill();
      });

      if (mx > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 220);
        grd.addColorStop(0, "rgba(13,148,136,0.06)");
        grd.addColorStop(1, "rgba(13,148,136,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="h-screen flex flex-col overflow-x-clip relative" style={{ background: "#EEF6F1" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 700, height: 700, borderRadius: "50%", top: "-15%", right: "-10%", zIndex: 0,
          background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, rgba(22,163,74,0.05) 45%, transparent 70%)" }}
        animate={{ x: [0, 30, -15, 0], y: [0, -25, 20, 0], scale: [1, 1.06, 0.97, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 500, height: 500, borderRadius: "50%", bottom: "-5%", left: "-8%", zIndex: 0,
          background: "radial-gradient(circle, rgba(101,163,13,0.09) 0%, rgba(13,148,136,0.04) 50%, transparent 72%)" }}
        animate={{ x: [0, -20, 25, 0], y: [0, 18, -10, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 380, height: 380, borderRadius: "50%", top: "30%", left: "35%", zIndex: 0,
          background: "radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 68%)" }}
        animate={{ x: [0, 22, -18, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0,
        backgroundImage: "linear-gradient(rgba(11,42,36,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(11,42,36,0.03) 1px, transparent 1px)",
        backgroundSize: "52px 52px" }} />

      {/* Nav */}
      <FI delay={0} y={-20}>
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 relative z-10">
          <span className="text-sm font-medium tracking-widest uppercase" style={{ color: "#0B1A14", opacity: 0.45 }}>
            Sachin Rai
          </span>
          <div className="flex items-center gap-8">
            {[["About", "about"], ["Journey", "journey"], ["Work", "work"], ["Contact", "contact"]].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm md:text-base font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-60"
                style={{ color: "#0B1A14" }}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      </FI>

      {/* Heading */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden px-6 md:px-10 relative z-10">
        <FI delay={0.15} y={40}>
          <div className="overflow-hidden">
            <h1
              className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full"
              style={{ fontSize: "clamp(3.5rem, 14vw, 14rem)" }}
            >
              hi, i&apos;m sachin
            </h1>
          </div>
        </FI>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-end pb-8 md:pb-10 px-6 md:px-10 relative z-10">
        <FI delay={0.35} y={20}>
          <p
            className="font-light uppercase tracking-wide leading-snug max-w-[180px] sm:max-w-[240px]"
            style={{ color: "#1A5C4A", fontSize: "clamp(0.7rem, 1.3vw, 1.1rem)" }}
          >
            cybersecurity pm · ai product leader
          </p>
        </FI>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#3E5A4E" }}>scroll</span>
        <motion.div
          className="w-px h-8 origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(13,148,136,0.5), transparent)" }}
          animate={{ scaleY: [1, 1.6, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
