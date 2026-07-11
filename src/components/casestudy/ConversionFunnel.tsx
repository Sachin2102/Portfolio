import React, { useState, useEffect } from 'react';

const stages = [
  { label: 'Daily Active Users',           count: '30M',   pct: '100%', color: 'from-indigo-500 to-indigo-400',   width: 100 },
  { label: 'Regularly Hit Feature Limits', count: '~9M',   pct: '30%',  color: 'from-cyan-500 to-cyan-400',       width: 30  },
  { label: 'See Upgrade Prompt',           count: '~4.5M', pct: '15%',  color: 'from-teal-500 to-teal-400',       width: 15  },
  { label: 'Click to Learn More',          count: '~2.1M', pct: '7%',   color: 'from-emerald-500 to-emerald-400', width: 7   },
  { label: 'Paying Users',                 count: '~1.5M', pct: '5%',   color: 'from-amber-500 to-amber-400',     width: 5   },
];

function useIsNarrow(breakpoint = 560) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 14 : 12, width: '100%', padding: '16px 0' }}>
      {stages.map((stage, i) => {
        const isAnimating = phase === 'animating';
        return (
          <div key={stage.label} style={narrow
            ? { display: 'flex', flexDirection: 'column', gap: 6 }
            : { display: 'flex', alignItems: 'center', height: 44, gap: 8 }
          }>
            <div style={narrow
              ? { textAlign: 'left' }
              : { width: 180, textAlign: 'right', paddingRight: 16, flexShrink: 0 }
            }>
              {phase === 'skeleton' ? (
                <div style={{ height: 12, borderRadius: 4, background: '#e2e8f0', marginLeft: narrow ? 0 : 'auto', width: narrow ? '50%' : '72%' }} />
              ) : (
                <span style={{ fontSize: narrow ? '0.85rem' : '0.95rem', color: '#475569', fontWeight: 500 }}>{stage.label}</span>
              )}
            </div>
            <div style={{ flex: narrow ? 'none' : 1, height: narrow ? 36 : '100%', display: 'flex', alignItems: 'center', width: narrow ? '100%' : 'auto' }}>
              {phase === 'skeleton' ? (
                <div style={{ height: '100%', borderRadius: '0 12px 12px 0', background: '#e2e8f0', width: `${stage.width}%` }} />
              ) : (
                <div style={{
                  height: '100%', borderRadius: '0 12px 12px 0',
                  background: `linear-gradient(90deg, ${colors[i]}cc, ${colors[i]})`,
                  display: 'flex', alignItems: 'center', paddingLeft: 14, paddingRight: 14,
                  overflow: 'hidden',
                  width: isAnimating ? `${stage.width}%` : '0%',
                  minWidth: isAnimating ? (narrow ? 64 : 80) : 0,
                  transition: `width 700ms ease-out ${i * 140}ms, min-width 700ms ease-out ${i * 140}ms`,
                }}>
                  <span style={{
                    color: '#fff', fontWeight: 700, fontSize: narrow ? '0.78rem' : '0.95rem', whiteSpace: 'nowrap',
                    opacity: isAnimating ? 1 : 0,
                    transition: `opacity 300ms ease ${i * 140 + 900}ms`,
                  }}>{stage.count} · {stage.pct}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
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
