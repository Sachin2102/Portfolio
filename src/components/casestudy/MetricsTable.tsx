import React from 'react';

const metrics = [
  { metric: 'Free-to-paid conversion rate',    baseline: '~5% (est.)',         target: '≥7% (+2pp)',          initiative: 'All four',      type: 'target' },
  { metric: 'Agent preview click-through',     baseline: 'Measure first',      target: '>12%',                initiative: 'Solution 1',    type: 'target' },
  { metric: 'Agent preview → Pro upgrade (7d)',baseline: 'Measure first',      target: '>8%',                 initiative: 'Solution 1',    type: 'target' },
  { metric: 'Email → upgrade click rate',      baseline: 'Current baseline ×3',target: 'Measurable lift',     initiative: 'Solution 2',    type: 'target' },
  { metric: 'Voice Profile 90d Pro retention', baseline: 'Measure current',    target: '≥85% (vs ~70%)',      initiative: 'Solution 3',    type: 'target' },
  { metric: 'Docs one-doc activation rate',    baseline: '0 (new)',            target: '≥20% of eligible DAU',initiative: 'Solution 4',    type: 'target' },
  { metric: 'Docs first-use → Pro (7d)',       baseline: '0 (new)',            target: '≥12%',                initiative: 'Solution 4',    type: 'target' },
  { metric: 'Free DAU 30-day retention',       baseline: 'Measure baseline',   target: 'No regression',       initiative: 'Guard-rail (all)', type: 'guardrail' },
];

export default function MetricsTable() {
  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <table style={{ width: '100%', textAlign: 'left', fontSize: '0.98rem', color: '#475569', background: '#fff', minWidth: 600, borderCollapse: 'collapse' }}>
        <thead style={{ background: '#1e293b', color: '#fff', fontWeight: 700 }}>
          <tr>
            <th style={{ padding: 16, borderRadius: '12px 0 0 0' }}>Metric</th>
            <th style={{ padding: 16 }}>Baseline</th>
            <th style={{ padding: 16 }}>6-Month Target</th>
            <th style={{ padding: 16, borderRadius: '0 12px 0 0' }}>Initiative</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((row, i) => (
            <tr key={i} style={{ borderTop: '1px solid #f1f5f9', background: row.type === 'guardrail' ? 'rgba(251,191,36,0.06)' : i % 2 === 0 ? '#fff' : '#f8fafc' }}>
              <td style={{ padding: 16, fontWeight: 500, color: '#0f172a' }}>{row.metric}</td>
              <td style={{ padding: 16, color: '#64748b' }}>{row.baseline}</td>
              <td style={{ padding: 16, fontWeight: 700, color: row.type === 'guardrail' ? '#b45309' : '#15B077' }}>{row.target}</td>
              <td style={{ padding: 16, color: '#64748b' }}>{row.initiative}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
