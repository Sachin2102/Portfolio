import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import RevenueChart from '@/components/casestudy/RevenueChart';
import ConversionFunnel from '@/components/casestudy/ConversionFunnel';
import CompetitorMatrix from '@/components/casestudy/CompetitorMatrix';
import CompetitorBarChart from '@/components/casestudy/CompetitorBarChart';
import SolutionCard from '@/components/casestudy/SolutionCard';
import MetricsTable from '@/components/casestudy/MetricsTable';
import PersonaCards from '@/components/casestudy/PersonaCards';
import { Mail, AlertTriangle } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const BG     = "#0e1117";
const CARD   = "#1a1f2b";
const CARD2  = "#141920";
const BORDER = "rgba(215,226,234,0.10)";
const TEXT   = "#F3F7FA";
const MUTED  = "rgba(230,238,244,0.92)";
const DIM    = "rgba(230,238,244,0.78)";
const ACCENT = "#15B077";

const sections = [
  { id: 'overview',    label: 'Overview'     },
  { id: 'research',    label: 'Research'     },
  { id: 'problem',     label: 'Problem'      },
  { id: 'audit',       label: 'Audit'        },
  { id: 'opportunity', label: 'Opportunity'  },
  { id: 'shipped',     label: "What's Built" },
  { id: 'solutions',   label: 'Solutions'    },
  { id: 'metrics',     label: 'Metrics'      },
  { id: 'takeaways',   label: 'Takeaways'    },
];

const SHIPPED = [
  { mark: '✓', title: 'Weekly Insights emails', since: 'Since 2019', body: 'Personalised weekly email with word count, accuracy score, and writing streak. Any solution that proposes "add a weekly email" is redundant.', highlight: false },
  { mark: '✓', title: 'Writing Goals & audience settings', since: 'March 2024', body: 'Users have the option to set audience, formality, domain, and intent. This feature already exists but is opt-in, and many free users never configure it.', highlight: false },
  { mark: '✓', title: '7-day free Premium trials', since: 'Ongoing', body: "Generic time-based trials have low conversion because users don't hit a high-stakes writing moment within 7 days.", highlight: false },
  { mark: '✓', title: 'GrammarlyGO generative AI', since: '2023', body: 'AI-powered text generation, tone rewrites, and email replies inside the extension. Available on free tier with monthly usage limits.', highlight: false },
  { mark: '✓', title: 'Grammarly Authorship + Originality', since: 'August 2024', body: 'AI detection and plagiarism checking combined into one tool. Launched for education and enterprise segments.', highlight: false },
  { mark: '★', title: '8 AI Agents in Grammarly Docs', since: 'August 2025 · BETA', body: 'Reader Reactions, AI Grader, Citation Finder, and AI Chat have been launched in a new Docs interface built on Coda. These features are available ONLY to Business, Enterprise, and Education users. Individual Pro users, who pay $12 per month, do not have access to any of these tools.', highlight: true },
];

const SOLUTIONS = [
  {
    num: '01',
    title: 'Unlock AI Agents for Individual Pro at the High-Stakes Moment',
    description: "Grammarly offers several impressive features, such as Reader Reactions, AI Grader, and Citation Finder, but these are only available to Business and Enterprise plan subscribers. Individual Pro users, who pay $12 per month, do not have access to any of these features, representing a significant opportunity for conversion. One potential solution is to make Reader Reactions available to individual Pro users with a limit of 5 uses per month, while offering unlimited access for Business plan subscribers.",
    mechanism: "The trigger: When Grammarly identifies a high-stakes document (such as a resume, cover letter, academic paper, or client proposal based on the file name or document structure), show free users a blurred one-sentence preview of what Reader Reactions would say about their specific document. Access to the full result requires a Pro subscription. This approach links the feature directly to a document that the user is already concerned about, rather than displaying a generic banner that encourages an upgrade for advanced features.",
    guardrail: "Cap the preview to one per session. A/B test preview length. Kill if free DAU drops by >2%.",
  },
  {
    num: '02',
    title: "Fix the Weekly Email — Show the Specific Thing They Missed",
    description: "Grammarly's weekly Insights email already exists and already goes to all users. But it shows engagement stats (words written, accuracy score, writing streak). It does NOT show what specific Pro or Agent suggestions the user missed that week. This is the gap.",
    mechanism: "Example copy: \"On Tuesday, you wrote an email that contained 847 words and appeared professional. Here’s what Reader Reactions noted: The opening paragraph may be considered vague; it might be more effective to state your main request right at the beginning. This insight was available with Pro, but you missed it.\" Remember, loss aversion is most effective when the loss feels tangible.",
    guardrail: "Target: 3× current email conversion rate. Never reveal the full suggestion text; only the first sentence. Opt-out is immediately available.",
  },
  {
    num: '03',
    title: "Personal Writing Voice Profile: The Cost of Switching to Grammarly",
    description: "After 90 days of Pro usage, a Personal Writing Voice Profile will be automatically generated. This profile includes the user's typical range of formality, sentence length patterns, common phrases, tone across different contexts, and a 'voice score' that is updated weekly. This feature is unique and cannot be replicated by ChatGPT, QuillBot, or LanguageTool since it relies on 90 days of user-specific writing history.",
    mechanism: "Demonstrate how tone shifts across different contexts. Professionals typically write in distinct styles depending on the medium, such as Slack messages versus client proposals. Allow users to set their preferred professional voice. If a drafted message strays from this voice, prompt them with a warning: \"This email appears significantly more casual than your usual professional tone. Would you like to adjust it?\" This feature helps create a profile that encourages pro users to remain engaged.",
    guardrail: "Primary goal: Achieve a 90-day Pro retention rate of at least 85% (compared to approximately 70%). Guardrail: Ensure the profile is fully user-controlled and deletable; any privacy concerns will undermine trust in the feature.",
  },
  {
    num: '04',
    title: "\Make the documentation writing environment easily accessible to allow users to work on one document at a time.",
    description: "In 2024, Grammarly acquired Coda and developed a new writing platform called Grammarly Docs, which features integrated AI assistance to enhance the writing process. However, free users are not aware of its existence. To address this, when a free user begins a long-form document (more than 500 words in a single session), a message will appear stating: \"You are writing something lengthy. Grammarly Docs is designed for this purpose. Open it in Docs for a better experience, free for this document.\"",
    mechanism: "The conversion mechanism is focused on user experience rather than paywalls. Once a user has written and edited a document in Docs with inline AI suggestions, the Reader Reactions feature, available only after the first document, seems limited by comparison. A follow-up prompt appears 24 hours later, stating, \"Your document is still here. Docs is available with Pro.\" Users already have ongoing work within the paid product.",
    guardrail: "Target: Activate Docs for ≥20% of eligible DAU, with ≥12% using Docs for the first time and upgrading to Pro within 7 days. Only ship when Docs quality is production-ready, not in beta.",
  },
];

const RISKS = [
  { risk: 'Agent preview feels like bait-and-switch', mitigation: "Displaying a blurred preview followed by gating may appear manipulative. To mitigate this, present a genuine, complete first sentence instead of a misleading teaser. The value must be authentic, or dismissal rates will increase. Conduct A/B tests on transparency levels." },
  { risk: 'Weekly email change creates unsubscribes', mitigation: "Changing a well-established email format risks disrupting a high-engagement channel. Mitigation: A/B test on 5% of users first. Set unsubscribe rate increase of >0.5pp as a kill criterion." },
  { risk: 'Voice Profile raises privacy concerns', mitigation: "Storing and profiling writing patterns over 90 days is a GDPR/CCPA concern. Mitigation: make it opt-in (not opt-out), fully visible and deletable, with explicit data processing consent. Cannot ship without legal review." },
  { risk: "Docs free experience cannibalises Pro trials", mitigation: "If a single-document experience is too beneficial, users may never upgrade. Mitigation: limit to one free document per account, not per document. Communicate this limit upfront, before users invest time." },
];

const TAKEAWAYS = [
  { color: ACCENT, text: "The research changes everything.", desc: "In many case studies involving Grammarly, two of the three proposed solutions- ' adding a weekly email' and 'making suggestions context-aware'are features that Grammarly has already implemented. A product manager who fails to research the product before suggesting solutions is essentially writing fiction." },
  { color: '#6366f1', text: "Grammarly's biggest unsolved problem in 2025 is access, not invention.", desc: "The AI agents (Reader Reactions, AI Grader, Citation Finder) are genuinely impressive and differentiated. They are locked behind Business and Enterprise. The highest-leverage move is getting individual Pro users to experience them." },
  { color: '#0891b2', text: "The revenue-per-user gap is not a pricing problem. It is a perceived-value problem.", desc: "Users often don't pay because they are unaware of what they're missing. Every solution in this case study aims to make that gap visible and clear. $0.70/month actual versus $12/month Pro price: a 17× difference." },
  { color: '#f59e0b', text: "The ChatGPT threat forces Grammarly up the value stack.", desc: "Away from grammar correction and toward professional writing intelligence: voice consistency, stakeholder-aware communication, citation integrity. The AI agents are the right bet. Closing the conversion gap is what funds building them at scale." },
  { color: '#7c3aed', text: "Switching costs are underrated as a conversion mechanic.", desc: "The Personal Writing Voice Profile is a valuable feature that offers 90 days of user-specific data, which cannot be exported to ChatGPT. The most effective freemium products create customer loyalty through accumulated value rather than imposing paywalls." },
];

const AUDIT_STEPS = [
  { num: 'Step 1', label: 'Install → Immediate Value', badge: 'STRONG', badgeColor: ACCENT, body: "The Chrome extension works within 60 seconds of signup. Errors are underlined, suggestions appear instantly. The time-to-value is excellent. This is why 30M people use it daily.", problem: "Users gain maximum value from their first session at no cost. There is no natural reason to upgrade from this experience.", problemColor: '#f59e0b' },
  { num: 'Step 2', label: 'The Upgrade Prompt', badge: 'WEAK', badgeColor: '#fb923c', body: "After some usage, a yellow banner appears: 'You have X more suggestions available with Premium.' It is easy to dismiss with a single click.", problem: "It does not say what those suggestions are, why they matter, or why right now is the moment to act. It appears mid-session with no connection to what the user is writing.", problemColor: '#fb923c' },
  { num: 'Step 3', label: 'The Locked Suggestions View', badge: 'MISSED OPPORTUNITY', badgeColor: '#ef4444', body: "Clicking the banner shows blurred placeholder cards. You can see there are suggestions, but not what they say. This is the right mechanic but the wrong moment.", problem: "Showing blurred suggestions when someone is writing a casual Slack message does not create urgency. Showing them on a job application cover letter does.", problemColor: '#ef4444' },
];

export default function CaseStudyGrammarly() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    return () => { document.documentElement.style.overflowX = ''; };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-20% 0px -60% 0px' }
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const ref = useScrollReveal({ delay });
    return <div ref={ref} className="reveal-on-scroll">{children}</div>;
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT, fontFamily: "'Times New Roman', Times, serif", paddingBottom: 96, position: 'relative' }}>

      {/* Sticky side nav */}
      <div style={{ display: 'none', position: 'fixed', right: 32, top: '50%', transform: 'translateY(-50%)', flexDirection: 'column', gap: 12, zIndex: 50 }}
        className="hidden lg:flex">
        {sections.map((s) => (
          <div key={s.id} onClick={() => scrollTo(s.id)} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}
            className="group">
            <span style={{ position: 'absolute', right: 24, padding: '4px 8px', fontSize: '1.2rem', borderRadius: 6, background: '#1e2530', color: TEXT, border: `1px solid ${BORDER}`, opacity: 0, whiteSpace: 'nowrap', pointerEvents: 'none', transition: 'opacity 0.2s' }}
              className="group-hover:opacity-100">{s.label}</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', transition: 'all 0.3s', background: activeSection === s.id ? ACCENT : 'rgba(215,226,234,0.2)', transform: activeSection === s.id ? 'scale(1.4)' : 'scale(1)' }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <header style={{ paddingTop: 48, paddingBottom: 64, paddingLeft: 'clamp(1.5rem,5vw,3rem)', paddingRight: 'clamp(1.5rem,5vw,3rem)', borderBottom: `1px solid ${BORDER}`, background: '#0d1117' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <button onClick={() => setLocation('/')}
            style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '1.15rem', letterSpacing: '0.1em', color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
            ← BACK TO PORTFOLIO
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(21,176,119,0.1)', color: ACCENT, border: 'rgba(21,176,119,0.2) 1px solid', marginBottom: 16 }}>
            PM CASE STUDY · JUNE 2026
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontWeight: 900, lineHeight: 1, color: TEXT, fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontFamily: "'Times New Roman', Times, serif" }}>Grammarly's</h1>
            <h1 style={{ fontWeight: 900, lineHeight: 1, fontFamily: "'Times New Roman', Times, serif", fontSize: 'clamp(2.8rem,7vw,5.5rem)', background: 'linear-gradient(135deg,#15B077 0%,#22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Conversion Problem</h1>
          </div>

          <p style={{ maxWidth: 640, fontSize: '1.25rem', lineHeight: 1.7, marginBottom: 40, color: MUTED }}>
            Why 30 Million Daily Users Don't Pay and What I'd Build to Fix It


          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { val: '30M+', label: 'Daily Active Users' },
              { val: '$251.8M', label: '2024 Revenue' },
              { val: '$13B', label: 'Valuation (2024)' },
              { val: '~5%', label: 'Est. Paying Users' },
            ].map((stat, i) => (
              <div key={i} style={{ borderRadius: 12, padding: 16, textAlign: 'center', background: CARD, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 700, color: TEXT }}>{stat.val}</div>
                <div style={{ fontSize: '1.15rem', fontFamily: "'Times New Roman', Times, serif", marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em', color: DIM }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 20, borderRadius: '0 12px 12px 0', background: 'rgba(21,176,119,0.07)', borderLeft: `4px solid ${ACCENT}` }}>
            <p style={{ fontSize: 'clamp(1.1rem,2vw,1.3rem)', fontWeight: 500, lineHeight: 1.6, color: ACCENT }}>
              Grammarly has 30 million people opening its product every single day and earns less than $1 per month from each of them. The Pro plan costs $12/month. That gap is the entire business problem. This case study is about closing it.
            </p>
          </div>

          {/*<div style={{ marginTop: 32, fontSize: '1.2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', color: DIM, fontFamily: "'Times New Roman', Times, serif" }}>*/}
          {/*  <span style={{ color: MUTED }}>By Sachin Rai</span>*/}
          {/*  <span>·</span><span>PM + Builder</span>*/}
          {/*  <span>·</span><span>MEM @ NC State</span>*/}
          {/*  <span>·</span><span>ex-Qualys</span>*/}
          {/*</div>*/}
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '64px clamp(1.5rem,5vw,3rem)', display: 'flex', flexDirection: 'column', gap: 128 }}>

        {/* 01 Overview */}
        <section id="overview" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(01) — Product Overview</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 40, color: TEXT }}>What is Grammarly?</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'start' }}>
            <Reveal delay={100}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, lineHeight: 1.7, color: MUTED, fontSize: '1.3rem' }}>
                <p>Founded in 2009, Grammarly is an AI-powered writing assistant that started as a grammar checker and has grown into a full writing intelligence platform, improving clarity, tone, style, and increasingly generating text.</p>
                <p>It works as a browser extension, desktop app, mobile keyboard, and inside Google Docs. As of 2024, it has over <strong style={{ color: TEXT }}>30 million daily active users</strong>, a $13 billion valuation, and serves 96% of Fortune 500 companies.</p>
                <p>Business Model: <strong style={{ color: TEXT }}>Classic Freemium SaaS.</strong> Free tier → Pro at $12/month → Enterprise at custom pricing.</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0' }}>
                <RevenueChart />
                <p style={{ fontSize: '1.2rem', marginTop: 12, textAlign: 'center', color: '#94a3b8' }}>Key inflection: Revenue nearly doubled 2022→2023 ($90M → $178.9M), driven by enterprise deals and AI feature launches. 2024: $251.8M · +40.7% YoY.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 02 Research */}
        <section id="research" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(02) — User Research</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 12, color: TEXT }}>Who Uses Grammarly? Three Distinct Personas</h2>
            <p style={{ marginBottom: 40, color: MUTED }}>Based on App Store reviews, Reddit, G2, and Grammarly's published research. Each segment has a different reason for not paying.</p>
          </Reveal>
          <Reveal delay={100}>
            <PersonaCards />
          </Reveal>
        </section>

        {/* 03 Problem */}
        <section id="problem" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(03) — Problem Statement</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 40, color: TEXT }}>The Real Problem: The Free Tier Is Too Good</h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ marginBottom: 48, padding: 28, borderRadius: 16, background: CARD, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: '1.15rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 16 }}>Personal Observation — The Author's Own Experience</div>
              <blockquote style={{ fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', lineHeight: 1.6, fontWeight: 500, color: TEXT, position: 'relative', paddingLeft: 24 }}>
                <span style={{ position: 'absolute', top: -16, left: -8, fontSize: '3rem', opacity: 0.3, color: ACCENT }}>"</span>
                I use Grammarly every day. I have used it for years. I have never paid for it, not because I can't afford $12/month, but because the free version does everything I actually need it to do.
              </blockquote>
              <p style={{ marginTop: 16, paddingLeft: 24, fontSize: '1.3rem', color: MUTED }}>That sentence is the entire product problem. When a daily active user who relies on your product has zero motivation to pay, you don't have a feature gap. You have a <strong style={{ color: ACCENT }}>conversion design problem</strong>.</p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: TEXT }}>The Conversion Gap</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16, marginBottom: 40 }}>
              {[
                { v: '30M',   l: 'Daily active users',  bg: 'rgba(215,226,234,0.05)', vc: TEXT,      lc: DIM,       b: BORDER },
                { v: '~1.5M', l: 'Est. paying users',   bg: 'rgba(215,226,234,0.05)', vc: TEXT,      lc: DIM,       b: BORDER },
                { v: '$0.70', l: 'Rev/user/mo (est.)',   bg: 'rgba(234,88,12,0.08)',   vc: '#fb923c', lc: '#fb923c', b: 'rgba(234,88,12,0.3)' },
                { v: '$12',   l: 'Pro plan price/mo',    bg: 'rgba(21,176,119,0.08)',  vc: ACCENT,    lc: ACCENT,    b: 'rgba(21,176,119,0.3)' },
              ].map((s, i) => (
                <div key={i} style={{ padding: 16, borderRadius: 12, textAlign: 'center', background: s.bg, border: `2px solid ${s.b}` }}>
                  <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: s.vc }}>{s.v}</div>
                  <div style={{ fontSize: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4, color: s.lc }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: TEXT }}>Three compounding reasons conversion stays low</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { n: '1', border: '#fbbf24', title: 'The free tier over-delivers on the core job.', body: "Grammar correction: The reason 90% of users sign up is that it is completely free and genuinely excellent. Users solve their core problem on day one and never hit a meaningful wall." },
                { n: '2', border: '#fb923c', title: 'The paywall appears at the wrong moment.', body: "Grammarly's upgrade prompt fires arbitrarily after a fixed number of suggestions or on a timer. It does not appear when the user is writing something that matters: a job application, a client proposal, a difficult email to a manager." },
                { n: '3', border: '#ef4444', title: 'The competitive moat on the free tier is gone.', body: "ChatGPT, Gemini, and Claude now match Grammarly Free on grammar, tone improvement, and full-text rewriting for free. The moat that kept free users on Grammarly instead of alternatives is narrowing fast." },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, padding: 20, borderRadius: 12, background: CARD, borderLeft: `4px solid ${r.border}` }}>
                  <div style={{ fontSize: '2.3rem', fontWeight: 900, flexShrink: 0, color: `${r.border}40` }}>{r.n}</div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: 4, color: TEXT }}>{r.title}</h4>
                    <p style={{ fontSize: '1.25rem', lineHeight: 1.7, color: MUTED }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ marginTop: 56 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: TEXT }}>Competitive Landscape: 8 Tools Compared</h3>
              <p style={{ marginBottom: 24, fontSize: '1.25rem', color: MUTED }}>Grammarly faces serious competition across every price point, from free AI tools like ChatGPT to dedicated writing tools like QuillBot and ProWritingAid.</p>
              <div style={{ marginBottom: 32, padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0' }}>
                <CompetitorBarChart />
              </div>
              <CompetitorMatrix />
              <div style={{ marginTop: 24, padding: 20, borderRadius: 12, background: 'rgba(234,88,12,0.06)', border: '1px solid rgba(234,88,12,0.2)' }}>
                <div style={{ fontSize: '1.15rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fb923c', marginBottom: 8 }}>Strategic Implication</div>
                <p style={{ fontSize: '1.25rem', lineHeight: 1.7, color: MUTED }}>
                  QuillBot Free now matches Grammarly Free on paraphrasing. ChatGPT Free beats Grammarly Free on tone, rewriting, and AI generation. <strong style={{ color: TEXT }}>This makes the conversion problem urgent: every day a free user isn't converted is a day they might switch to a free alternative instead.</strong>
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 04 Audit */}
        <section id="audit" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(04) — Current Experience Audit</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 12, color: TEXT }}>What Grammarly Does Today, and Where It Breaks Down</h2>
            <p style={{ marginBottom: 40, color: MUTED }}>I signed up for the free plan and used it across multiple writing sessions, emails, documents, and a mock cover letter.</p>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {AUDIT_STEPS.map((step, i) => (
              <Reveal key={i} delay={100 * (i + 1)}>
                <div style={{ display: 'flex', flexDirection: 'row', borderRadius: 16, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                  <div style={{ width: 180, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, background: CARD2 }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>{step.num}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3, color: TEXT }}>{step.label}</div>
                    </div>
                    <div style={{ marginTop: 16, display: 'inline-block', padding: '4px 12px', borderRadius: 9999, fontSize: '1.15rem', fontWeight: 700, background: `${step.badgeColor}18`, color: step.badgeColor, border: `1px solid ${step.badgeColor}40` }}>{step.badge}</div>
                  </div>
                  <div style={{ padding: 24, flex: 1, background: CARD }}>
                    <p style={{ fontSize: '1.25rem', lineHeight: 1.7, marginBottom: 16, color: MUTED }}>{step.body}</p>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 12, background: `${step.problemColor}0d`, border: `1px solid ${step.problemColor}30` }}>
                      <AlertTriangle size={16} style={{ color: step.problemColor, marginTop: 2, flexShrink: 0 }} />
                      <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: MUTED }}><strong style={{ color: step.problemColor }}>PM Observation: </strong>{step.problem}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 05 Opportunity */}
        <section id="opportunity" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(05) — Opportunity Sizing</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 12, color: TEXT }}>Why This Is the Highest-Leverage Problem in the Business</h2>
            <p style={{ marginBottom: 40, color: MUTED }}>Grammarly does not have a user acquisition problem. It has a monetisation problem.</p>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ padding: '24px 32px', borderRadius: 16, marginBottom: 32, background: '#fff', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>The conversion funnel: where users are lost</h3>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: 16 }}>Each stage represents estimated users based on public data and industry benchmarks</p>
              <ConversionFunnel />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: TEXT }}>The revenue math</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
              {[
                { label: 'Conservative', sub: '+1% conversion lift', color: DIM, bg: CARD, border: BORDER, items: ['+300,000 paying users', '+$43.2M ARR', '~17% revenue increase from current base'] },
                { label: 'Moderate', sub: '+2% conversion lift', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.4)', items: ['+600,000 paying users', '+$86.4M ARR', 'A single product enhancement resulted in a 34% increase in revenue.'] },
                { label: 'Ambitious', sub: '+5% conversion lift', color: ACCENT, bg: `rgba(21,176,119,0.06)`, border: `rgba(21,176,119,0.25)`, items: ['+1.5M paying users', '+$216M ARR', 'Would nearly double 2024 revenue'] },
              ].map((tier, i) => (
                <div key={i} style={{ padding: 24, borderRadius: 12, background: tier.bg, border: `2px solid ${tier.border}` }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 2, color: tier.color }}>{tier.label}</div>
                  <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", marginBottom: 16, color: DIM }}>{tier.sub}</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tier.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: j === 1 ? '1rem' : '0.85rem', fontWeight: j === 1 ? 700 : 400, color: j === 1 ? TEXT : MUTED }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: tier.color, marginTop: 6, flexShrink: 0 }} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 06 What's Built */}
        <section id="shipped" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(06) — Research First</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 12, color: TEXT }}>What Grammarly Has Already Shipped</h2>
            <p style={{ color: MUTED, marginBottom: 8 }}>Before proposing solutions, I audited Grammarly's current product state. A PM who suggests features that already exist hasn't done the research.</p>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {SHIPPED.map((item, i) => (
                <div key={i} style={{ padding: 20, borderRadius: 12, display: 'flex', gap: 16, background: item.highlight ? 'rgba(21,176,119,0.07)' : CARD, border: item.highlight ? '1px solid rgba(21,176,119,0.25)' : `1px solid ${BORDER}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '1.2rem', background: item.highlight ? 'rgba(21,176,119,0.2)' : 'rgba(215,226,234,0.08)', color: item.highlight ? ACCENT : DIM }}>{item.mark}</div>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1.25rem', color: TEXT }}>{item.title}</h4>
                      <span style={{ fontSize: '1.15rem', padding: '2px 8px', borderRadius: 9999, fontFamily: "'Times New Roman', Times, serif", background: 'rgba(215,226,234,0.07)', color: DIM }}>{item.since}</span>
                    </div>
                    <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: MUTED }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: 20, borderRadius: 12, background: CARD2, borderLeft: `4px solid ${ACCENT}`, border: `1px solid rgba(21,176,119,0.2)` }}>
              <div style={{ fontSize: '1.15rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>The Research Conclusion</div>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.7, color: MUTED }}>
                In 2025, Grammarly's product team launched several ambitious features, particularly focusing on AI agents. The problem is <strong style={{ color: TEXT }}>distribution and access, not invention.</strong> The most powerful new features are locked behind Business and Enterprise tiers. This creates a clear, concrete, unsolved conversion opportunity.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 06b Solutions */}
        <section id="solutions" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(06b) — Proposed Solutions</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 12, color: TEXT }}>Four Changes I Would Implement Based on the Current Product Status</h2>
            <p style={{ marginBottom: 40, color: MUTED }}>These solutions are grounded in what Grammarly has already built. Each one addresses a gap that exists today.</p>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {SOLUTIONS.map((s, i) => (
              <SolutionCard key={i} index={i} num={s.num} title={s.title} description={s.description} mechanism={s.mechanism} guardrail={s.guardrail} />
            ))}
          </div>
        </section>

        {/* 07 Metrics */}
        <section id="metrics" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <div style={{ fontSize: '1.2rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM, marginBottom: 12 }}>(07) — Metrics & Tradeoffs</div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 12, color: TEXT }}>How I Would Measure Success</h2>
            <p style={{ marginBottom: 32, color: MUTED }}>Strong PM thinking involves defining what success looks like before any solutions are proposed.</p>
          </Reveal>
          <Reveal delay={100}><div style={{ marginBottom: 48 }}><MetricsTable /></div></Reveal>
          <Reveal delay={200}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: TEXT }}>Risks and how I would guard against them</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {RISKS.map((r, i) => (
                <div key={i} style={{ padding: 20, borderRadius: 12, display: 'flex', gap: 16, background: CARD, borderLeft: '4px solid #ef4444', border: `1px solid ${BORDER}` }}>
                  <AlertTriangle size={18} style={{ color: '#ef4444', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: 6, fontSize: '1.25rem', color: TEXT }}>{r.risk}</h4>
                    <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: MUTED }}>{r.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 08 Takeaways */}
        <section id="takeaways" style={{ scrollMarginTop: 48 }}>
          <Reveal>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: 40, textAlign: 'center', color: TEXT }}>Key Takeaways</h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, margin: '0 auto' }}>
            {TAKEAWAYS.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: 24, borderRadius: '0 16px 16px 0', background: CARD, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${t.color}`, transition: 'transform 0.3s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
                  <div style={{ fontSize: '2.3rem', fontWeight: 900, flexShrink: 0, color: 'rgba(215,226,234,0.1)', lineHeight: 1 }}>0{i + 1}</div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 6, color: TEXT }}>{t.text}</h4>
                    <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: MUTED }}>{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ paddingTop: 64, paddingBottom: 64, marginTop: 32, textAlign: 'center', background: '#0d1117', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 512, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
            {[
              { href: "https://www.linkedin.com/in/sachin-rai21/", icon: <FaLinkedin size={16} />, label: "LinkedIn" },
              { href: "https://github.com/Sachin2102", icon: <FaGithub size={16} />, label: "GitHub" },
              { href: "mailto:sachin.rai2113@gmail.com", icon: <Mail size={16} />, label: "Email" },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9999, fontSize: '1.2rem', fontWeight: 500, textDecoration: 'none', background: 'rgba(215,226,234,0.07)', color: MUTED, border: `1px solid ${BORDER}` }}>
                {link.icon} {link.label}
              </a>
            ))}
          </div>
          <button onClick={() => setLocation('/')}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 24px', borderRadius: 12, fontWeight: 500, cursor: 'pointer', background: CARD, color: TEXT, border: `1px solid ${BORDER}` }}>
            ← Back to Portfolio
          </button>
        </div>
      </footer>
    </div>
  );
}
