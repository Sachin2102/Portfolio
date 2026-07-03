import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const data = [
  { year: '2022', revenue: 90 },
  { year: '2023', revenue: 178.9, yoy: '+98.8%' },
  { year: '2024', revenue: 251.8, yoy: '+40.7%' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = data.find((d) => d.year === label) as any;
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#2563EB', fontWeight: 600 }}>${payload[0].value}M revenue</div>
        {item?.yoy && <div style={{ color: '#16a34a', fontSize: '0.88rem', marginTop: 4, fontWeight: 500 }}>{item.yoy} YoY</div>}
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ x, y, width, value }: any) => (
  <text x={x + width / 2} y={y - 8} textAnchor="middle" fill="#1e293b" fontSize={13} fontWeight={700}>${value}M</text>
);

export default function RevenueChart() {
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 900);
    const t2 = setTimeout(() => setAnimate(true), 950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Trajectory</span>
        <span style={{ background: '#dcfce7', color: '#15803d', padding: '5px 13px', borderRadius: 9999, fontSize: '0.88rem', fontWeight: 700, border: '1px solid #bbf7d0' }}>2024 · +40.7% YoY</span>
      </div>
      {loading ? (
        <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 32px 32px', gap: 24 }}>
          {[55, 80, 100].map((pct, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', height: pct * 1.8, background: 'linear-gradient(180deg, #e2e8f0 0%, #f1f5f9 100%)', borderRadius: '4px 4px 0 0' }} />
              <div style={{ height: 12, width: 40, borderRadius: 4, background: '#e2e8f0' }} />
            </div>
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 28, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="bar0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bfdbfe" /><stop offset="100%" stopColor="#93C5FD" /></linearGradient>
              <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93C5FD" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
              <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}M`} domain={[0, 280]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.7)', radius: 4 }} />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={52} isAnimationActive={animate} animationDuration={900} animationEasing="ease-out">
              <LabelList content={<CustomLabel />} />
              {data.map((_, i) => <Cell key={i} fill={`url(#bar${i})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4, textAlign: 'center' }}>Revenue figures in USD millions · Source: public filings and estimates</p>
    </div>
  );
}
