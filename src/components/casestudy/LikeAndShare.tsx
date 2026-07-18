import React, { useEffect, useState } from 'react';
import { ThumbsUp, Share2 } from 'lucide-react';
import { supabase, supabaseEnabled } from '@/lib/supabase';

const SLUG = 'grammarly';
const LOCAL_KEY = 'liked-case-study-grammarly';

export default function LikeAndShare({ accent, dim, card, border }: { accent: string; dim: string; card: string; border: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [liked, setLiked] = useState(() => typeof window !== 'undefined' && localStorage.getItem(LOCAL_KEY) === '1');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) return;

    let active = true;
    supabase
      .from('case_study_likes')
      .select('count')
      .eq('slug', SLUG)
      .maybeSingle()
      .then(({ data }) => { if (active) setLikes(data?.count ?? 0); });

    const channel = supabase
      .channel('case_study_likes_grammarly')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'case_study_likes', filter: `slug=eq.${SLUG}` }, (payload) => {
        setLikes((payload.new as { count?: number })?.count ?? 0);
      })
      .subscribe();

    return () => { active = false; supabase!.removeChannel(channel); };
  }, []);

  const handleLike = async () => {
    if (!supabaseEnabled || !supabase) return;
    const next = !liked;
    setLiked(next);
    if (next) localStorage.setItem(LOCAL_KEY, '1');
    else localStorage.removeItem(LOCAL_KEY);
    await supabase.rpc('increment_case_study_like', { p_slug: SLUG, p_delta: next ? 1 : -1 });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Grammarly's Conversion Problem — PM Case Study", url: shareUrl });
        return;
      } catch {
        /* user cancelled or share unavailable, fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <button
        onClick={handleLike}
        disabled={!supabaseEnabled}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 9999,
          background: liked ? `${accent}22` : card, border: `1px solid ${liked ? accent : border}`,
          color: liked ? accent : dim, cursor: !supabaseEnabled ? 'default' : 'pointer', fontWeight: 600, fontSize: '0.95rem',
        }}
      >
        <ThumbsUp size={16} fill={liked ? accent : 'none'} />
        {likes ? likes : 'Like'}
      </button>

      <div>
        <button
          onClick={handleShare}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 9999,
            background: card, border: `1px solid ${border}`, color: dim, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
          }}
        >
          <Share2 size={16} />
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
}
