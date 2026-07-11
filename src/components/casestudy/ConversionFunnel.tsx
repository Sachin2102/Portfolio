import React, { useState, useEffect } from 'react';

const stages = [
  { label: 'Daily Active Users',           count: '30M',   pct: '100%', width: 100 },
  { label: 'Regularly Hit Feature Limits', count: '~9M',   pct: '30%',  width: 30  },
  { label: 'See Upgrade Prompt',           count: '~4.5M', pct: '15%',  width: 15  },
  { label: 'Click to Learn More',          count: '~2.1M', pct: '7%',   width: 7   },
  { label: 'Paying Users',                 count: '~1.5M', pct: '5%',   width: 5   },
];

function useIsNarrow(breakpoint = 640) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return narrow;
}

export default function ConversionFunnel() {
  const [phase, setPhase] = useState<'skeleton' | 'ready' | 'animating'>('skeleton');
  const narrow = useIsNarrow();

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('ready');
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('animating')));
    }, 900);
    return () => clearTimeout(t1);
  }, []);

  const colors = ['#6366f1', '#06b6d4', '#14b8a6', '#10b981', '#f59e0b'];
  const isAnimating = phase === 'animating';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', padding: '16px 0' }}>
      {stages.map((stage, i) => (
        <div key={stage.label} style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', alignItems: narrow ? 'stretch' : 'center', gap: narrow ? 6 : 8 }}>
          <div style={{ width: narrow ? 'auto' : 200, textAlign: narrow ? 'left' : 'right', paddingRight: narrow ? 0 : 16, flexShrink: 0 }}>
            {phase === 'skeleton' ? (
              <div style={{ height: 12, borderRadius: 4, background: '#e2e8f0', marginLeft: narrow ? 0 : 'auto', width: narrow ? '50%' : '72%' }} />
            ) : (
              <span style={{ fontSize: narrow ? '0.85rem' : '0.95rem', color: '#475569', fontWeight: 500 }}>{stage.label}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{ flex: 1, height: narrow ? 28 : 32, borderRadius: 8, background: phase === 'skeleton' ? '#e2e8f0' : 'rgba(148,163,184,0.15)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 8,
                background: `linear-gradient(90deg, ${colors[i]}cc, ${colors[i]})`,
                width: isAnimating ? `${Math.max(stage.width, 6)}%` : '0%',
                transition: `width 700ms ease-out ${i * 140}ms`,
              }} />
            </div>
            <span style={{
              color: '#334155', fontWeight: 700, fontSize: narrow ? '0.82rem' : '0.92rem', whiteSpace: 'nowrap', flexShrink: 0,
              opacity: phase === 'skeleton' ? 0 : 1,
              transition: `opacity 300ms ease ${i * 140 + 200}ms`,
            }}>{stage.count} · {stage.pct}</span>
          </div>
        </div>
      ))}
      {phase === 'animating' && (
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {[
            { label: 'DAU → Feature Wall', drop: '−70%', color: '#f59e0b' },
            { label: 'Prompt → Click', drop: '−53%', color: '#fb923c' },
            { label: 'Click → Paying', drop: '−29%', color: '#ef4444' },
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9999, fontSize: '0.88rem', fontWeight: 500, border: `1px solid ${d.color}40`, background: `${d.color}10`, color: d.color }}>
              <span>{d.label}</span>
              <span style={{ fontWeight: 700 }}>{d.drop}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
