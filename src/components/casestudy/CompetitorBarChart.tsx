import React, { useEffect, useRef, useState } from 'react';

const tools = [
  { name: 'Grammarly Pro',  score: 87, color: '#15B077', type: 'grammarly' },
  { name: 'ChatGPT Free',   score: 83, color: '#10a37f', type: 'competitor' },
  { name: 'Claude',         score: 81, color: '#d97757', type: 'competitor' },
  { name: 'ProWritingAid',  score: 72, color: '#ff6653', type: 'competitor' },
  { name: 'Grammarly Free', score: 67, color: '#86efac', type: 'grammarly' },
  { name: 'QuillBot Free',  score: 55, color: '#44a047', type: 'competitor' },
  { name: 'Hemingway',      score: 45, color: '#ca8a04', type: 'competitor' },
  { name: 'LanguageTool',   score: 41, color: '#2b78c5', type: 'competitor' },
];

export default function CompetitorBarChart() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: '0.85rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>Overall Writing Capability Score</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tools.map((tool, i) => (
          <div key={tool.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 140, textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: tool.type === 'grammarly' ? 700 : 500, color: tool.type === 'grammarly' ? '#1e293b' : '#475569' }}>{tool.name}</span>
            </div>
            <div style={{ flex: 1, height: 32, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px',
                width: animate ? `${(tool.score / 100) * 100}%` : '0%',
                background: tool.type === 'grammarly' ? `linear-gradient(90deg, ${tool.color}cc, ${tool.color})` : `linear-gradient(90deg, ${tool.color}88, ${tool.color}bb)`,
                transition: `width 700ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
              }}>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, opacity: animate ? 1 : 0, transition: `opacity 300ms ease ${i * 80 + 500}ms` }}>{tool.score}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>Scores are composite estimates across: grammar accuracy, tone analysis, AI generation, paraphrasing, and contextual rewriting.</p>
    </div>
  );
}
