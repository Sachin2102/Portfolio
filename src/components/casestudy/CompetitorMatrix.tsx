import React from 'react';

const features = ['Grammar Check', 'Tone Analysis', 'AI Generation', 'Paraphrasing', 'Plagiarism Check'];
const data = [
  { name: 'Grammarly Free', color: '#15B077', type: 'grammarly', scores: ['full', 'half', 'half', 'empty', 'empty'] },
  { name: 'Grammarly Pro',  color: '#15B077', type: 'grammarly', scores: ['full', 'full',  'full',  'empty', 'full'] },
  { name: 'ChatGPT Free',   color: '#10a37f', type: 'competitor', scores: ['half', 'full',  'full',  'full',  'empty'] },
  { name: 'QuillBot Free',  color: '#44a047', type: 'competitor', scores: ['half', 'empty', 'half',  'full',  'empty'] },
  { name: 'LanguageTool',   color: '#2b78c5', type: 'competitor', scores: ['full', 'empty', 'empty', 'empty', 'empty'] },
  { name: 'ProWritingAid',  color: '#ff6653', type: 'competitor', scores: ['full', 'half',  'half',  'half',  'full'] },
  { name: 'Hemingway',      color: '#ffce5c', type: 'competitor', scores: ['half', 'full',  'empty', 'empty', 'empty'] },
  { name: 'Claude',         color: '#d97757', type: 'competitor', scores: ['half', 'full',  'full',  'full',  'empty'] },
];

function Circle({ type, color }: { type: string; color: string }) {
  if (type === 'full') return <div style={{ width: 20, height: 20, borderRadius: '50%', background: color, margin: '0 auto' }} />;
  if (type === 'half') return (
    <div style={{ width: 20, height: 20, borderRadius: '50%', overflow: 'hidden', position: 'relative', background: '#e2e8f0', margin: '0 auto', border: '1px solid #cbd5e1' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', background: color }} />
    </div>
  );
  return <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #e2e8f0', margin: '0 auto' }} />;
}

export default function CompetitorMatrix() {
  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', background: '#fff' }}>
      <table style={{ width: '100%', fontSize: '0.98rem', minWidth: 700, borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f8fafc', color: '#475569' }}>
          <tr>
            <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Tool</th>
            {features.map(f => (
              <th key={f} style={{ padding: 16, textAlign: 'center', fontWeight: 700, borderBottom: '1px solid #e2e8f0', fontSize: '0.88rem' }}>{f}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.name} style={{ borderBottom: '1px solid #f1f5f9', background: row.type === 'grammarly' ? 'rgba(21,176,119,0.04)' : undefined }}>
              <td style={{ padding: 16, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                {row.name}
              </td>
              {row.scores.map((score, j) => (
                <td key={j} style={{ padding: 16, textAlign: 'center' }}>
                  <Circle type={score} color={row.color} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: 16, fontSize: '0.85rem', color: '#64748b', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 24, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#1e293b' }} /> Full Support</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', overflow: 'hidden', position: 'relative', background: '#e2e8f0' }}><div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', background: '#1e293b' }} /></div>
          Partial
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #cbd5e1' }} /> None</div>
      </div>
    </div>
  );
}
