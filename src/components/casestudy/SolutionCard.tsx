import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SolutionCardProps {
  num: string;
  title: string;
  description: string;
  mechanism: string;
  guardrail: string;
  index: number;
}

export default function SolutionCard({ num, title, description, mechanism, guardrail, index }: SolutionCardProps) {
  const ref = useScrollReveal({ delay: index * 100 });

  return (
    <div
      ref={ref}
      className="reveal-on-scroll"
      style={{
        background: '#fff', borderRadius: 16, padding: 'clamp(1.5rem,3vw,2rem)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column', gap: 16,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#f1f5f9', flexShrink: 0, lineHeight: 1 }}>{num}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'clamp(1rem,2.5vw,1.3rem)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</h3>
          <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.02rem' }}>{description}</p>
        </div>
      </div>
      <div style={{ background: 'rgba(21,176,119,0.08)', padding: 16, borderRadius: 12, border: '1px solid rgba(21,176,119,0.2)' }}>
        <p style={{ fontSize: '0.98rem', color: '#1e293b' }}>
          <span style={{ fontWeight: 700, color: '#15B077', display: 'block', marginBottom: 4 }}>Mechanism:</span>
          {mechanism}
        </p>
      </div>
      <div>
        <span style={{ display: 'inline-block', padding: '5px 13px', background: '#fffbeb', color: '#b45309', fontSize: '0.85rem', fontWeight: 700, borderRadius: 9999, border: '1px solid #fde68a' }}>
          Guard-rail: {guardrail}
        </span>
      </div>
    </div>
  );
}
