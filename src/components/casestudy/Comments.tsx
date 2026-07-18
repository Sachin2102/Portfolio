import React, { useEffect, useState } from 'react';
import { supabase, supabaseEnabled } from '@/lib/supabase';

const SLUG = 'grammarly';

type CommentRow = { id: string; name: string; message: string; created_at: string };

export default function Comments({ accent, dim, text, card, border, muted }: { accent: string; dim: string; text: string; card: string; border: string; muted: string }) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) return;

    let active = true;
    supabase
      .from('case_study_comments')
      .select('id, name, message, created_at')
      .eq('slug', SLUG)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (active && data) setComments(data as CommentRow[]); });

    const channel = supabase
      .channel('case_study_comments_grammarly')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'case_study_comments', filter: `slug=eq.${SLUG}` }, (payload) => {
        setComments((prev) => [payload.new as CommentRow, ...prev]);
      })
      .subscribe();

    return () => { active = false; supabase!.removeChannel(channel); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseEnabled || !supabase || !name.trim() || !message.trim() || submitting) return;
    setSubmitting(true);
    await supabase.from('case_study_comments').insert({
      slug: SLUG,
      name: name.trim().slice(0, 60),
      message: message.trim().slice(0, 1000),
    });
    setMessage('');
    setSubmitting(false);
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: text }}>Comments {comments.length > 0 && `(${comments.length})`}</h3>

      <form onSubmit={submit} style={{ marginBottom: 32, padding: 20, borderRadius: 12, background: card, border: `1px solid ${border}` }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          style={{ width: '100%', marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: 'transparent', border: `1px solid ${border}`, color: text, fontSize: '0.95rem', fontFamily: 'inherit' }}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment..."
          maxLength={1000}
          rows={3}
          style={{ width: '100%', marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: 'transparent', border: `1px solid ${border}`, color: text, fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' }}
        />
        <button
          type="submit"
          disabled={!supabaseEnabled || !name.trim() || !message.trim() || submitting}
          style={{ padding: '10px 20px', borderRadius: 9999, background: `${accent}22`, border: `1px solid ${accent}`, color: accent, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
        {!supabaseEnabled && (
          <p style={{ marginTop: 10, fontSize: '0.8rem', color: dim }}>Comments are temporarily unavailable.</p>
        )}
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {comments.map((c) => (
          <div key={c.id} style={{ padding: 16, borderRadius: 12, background: card, border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: text }}>{c.name}</span>
              <span style={{ fontSize: '0.8rem', color: dim }}>
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: muted, lineHeight: 1.6 }}>{c.message}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p style={{ color: dim, fontSize: '0.9rem' }}>Be the first to comment.</p>
        )}
      </div>
    </div>
  );
}
