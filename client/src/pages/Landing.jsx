import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-time Sync',
    desc: 'Character-by-character sync using Socket.io. Every keystroke instantly reflected on all connected editors.',
    color: '#00ff46',
  },
  {
    icon: '🤖',
    title: 'AI Code Reviewer',
    desc: 'Powered by Groq AI. Get instant feedback on bugs, time complexity, code smells, and better approaches.',
    color: '#9b59b6',
  },
  {
    icon: '▶',
    title: 'Multi-language Execution',
    desc: 'Run Python, JavaScript, Java, C++ and C directly in the browser. Powered by Judge0 sandbox engine.',
    color: '#74b9ff',
  },
  {
    icon: '👥',
    title: 'User Presence',
    desc: 'See who is online with colored avatars, typing indicators, and live user count in real-time.',
    color: '#fd79a8',
  },
  {
    icon: '💬',
    title: 'Live Chat',
    desc: 'Built-in chat panel inside every room. Discuss code, share ideas without leaving the editor.',
    color: '#ffe66d',
  },
  {
    icon: '🔒',
    title: 'Private Rooms',
    desc: 'Create rooms with unique IDs. Share with teammates. Only people with the room ID can join.',
    color: '#55efc4',
  },
];

const STEPS = [
  { step: '01', title: 'Create a Room', desc: 'Click "Start Coding" and generate a unique room ID instantly.' },
  { step: '02', title: 'Share the ID', desc: 'Send the room ID to your teammates, friends, or interviewer.' },
  { step: '03', title: 'Code Together', desc: 'Everyone joins and sees the same code in real-time. Start collaborating!' },
];

const LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++', 'C'];

export default function Landing() {
  const [hovering, setHovering] = useState('');

  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <section style={s.hero}>
        {/* Glow effects */}
        <div style={s.glow1} />
        <div style={s.glow2} />

        {/* Badge */}
        <div style={s.heroBadge}>
          <span style={s.badgeDot} />
          <span style={s.badgeText}>Real-time Collaborative Editor</span>
        </div>

        {/* Heading */}
        <h1 style={s.heroTitle}>
          Code Together,<br />
          <span style={s.heroGreen}>In Real-Time</span>
        </h1>

        <p style={s.heroDesc}>
          CodeSync is a collaborative coding platform where multiple developers
          can write, run, and review code simultaneously — like Google Docs for code.
        </p>

        {/* Language pills */}
        <div style={s.langRow}>
          {LANGUAGES.map((lang) => (
            <span key={lang} style={s.langPill}>{lang}</span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={s.ctaRow}>
          <Link
            to="/room"
            style={{
              ...s.ctaPrimary,
              boxShadow: hovering === 'cta'
                ? '0 0 30px rgba(0,255,70,0.5)'
                : '0 0 15px rgba(0,255,70,0.2)',
              transform: hovering === 'cta' ? 'translateY(-2px)' : 'none',
            }}
            onMouseEnter={() => setHovering('cta')}
            onMouseLeave={() => setHovering('')}
          >
            🚀 Start Coding Now
          </Link>
          <Link
            to="/room"
            style={{
              ...s.ctaSecondary,
              borderColor: hovering === 'join' ? '#00ff4660' : '#00ff4620',
              color: hovering === 'join' ? '#00ff46' : '#555',
            }}
            onMouseEnter={() => setHovering('join')}
            onMouseLeave={() => setHovering('')}
          >
            Join a Room →
          </Link>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { val: '5+', label: 'Languages' },
            { val: '<50ms', label: 'Sync Latency' },
            { val: 'AI', label: 'Code Review' },
            { val: '∞', label: 'Rooms' },
          ].map((stat) => (
            <div key={stat.label} style={s.statItem}>
              <div style={s.statVal}>{stat.val}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionBadge}>FEATURES</div>
          <h2 style={s.sectionTitle}>Everything you need to<br />
            <span style={s.green}>code collaboratively</span>
          </h2>
          <p style={s.sectionDesc}>
            Built with modern tech stack — React, Node.js, Socket.io, Judge0, and Groq AI.
          </p>

          <div style={s.featuresGrid}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  ...s.featureCard,
                  borderColor: hovering === f.title ? f.color + '40' : '#ffffff08',
                  transform: hovering === f.title ? 'translateY(-4px)' : 'none',
                }}
                onMouseEnter={() => setHovering(f.title)}
                onMouseLeave={() => setHovering('')}
              >
                <div style={{ ...s.featureIcon, background: f.color + '15', color: f.color }}>
                  {f.icon}
                </div>
                <div style={{ ...s.featureTitle, color: f.color }}>{f.title}</div>
                <div style={s.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="about" style={{ ...s.section, background: '#0d1117' }}>
        <div style={s.sectionInner}>
          <div style={s.sectionBadge}>HOW IT WORKS</div>
          <h2 style={s.sectionTitle}>
            Start collaborating in<br />
            <span style={s.green}>3 simple steps</span>
          </h2>

          <div style={s.stepsRow}>
            {STEPS.map((step, i) => (
              <div key={step.step} style={s.stepCard}>
                <div style={s.stepNum}>{step.step}</div>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
                {i < STEPS.length - 1 && <div style={s.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={s.ctaBanner}>
        <div style={s.ctaGlow} />
        <h2 style={s.ctaTitle}>Ready to code together?</h2>
        <p style={s.ctaDesc}>Create a room in seconds. No signup required.</p>
        <Link
          to="/room"
          style={{
            ...s.ctaPrimary,
            fontSize: '16px',
            padding: '14px 36px',
          }}
        >
          🚀 Launch Editor
        </Link>
      </section>

      <Footer />
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    fontFamily: "'Fira Code', 'Courier New', monospace",
    color: '#e6edf3',
    paddingTop: '60px',
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '80px 40px',
    position: 'relative',
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(0,255,70,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(155,89,182,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#00ff4610',
    border: '1px solid #00ff4630',
    borderRadius: '20px',
    padding: '6px 16px',
    marginBottom: '32px',
    zIndex: 1,
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00ff46',
    boxShadow: '0 0 6px #00ff46',
    display: 'inline-block',
  },
  badgeText: {
    fontSize: '12px',
    color: '#00ff46',
    letterSpacing: '1px',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: 'bold',
    lineHeight: '1.1',
    margin: '0 0 24px',
    zIndex: 1,
    letterSpacing: '-1px',
  },
  heroGreen: {
    color: '#00ff46',
    textShadow: '0 0 40px rgba(0,255,70,0.3)',
  },
  heroDesc: {
    fontSize: '16px',
    color: '#555',
    maxWidth: '560px',
    lineHeight: '1.8',
    margin: '0 0 32px',
    zIndex: 1,
  },
  langRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '40px',
    zIndex: 1,
  },
  langPill: {
    padding: '6px 16px',
    borderRadius: '20px',
    background: '#ffffff08',
    border: '1px solid #ffffff10',
    fontSize: '12px',
    color: '#666',
  },
  ctaRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    marginBottom: '60px',
    zIndex: 1,
  },
  ctaPrimary: {
    padding: '12px 28px',
    borderRadius: '10px',
    border: 'none',
    background: '#00ff46',
    color: '#0a0a0a',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: "'Fira Code', monospace",
    transition: 'all 0.2s',
    display: 'inline-block',
  },
  ctaSecondary: {
    padding: '12px 28px',
    borderRadius: '10px',
    border: '1px solid',
    background: 'transparent',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: "'Fira Code', monospace",
    transition: 'all 0.2s',
    display: 'inline-block',
  },
  statsRow: {
    display: 'flex',
    gap: '48px',
    zIndex: 1,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statVal: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#00ff46',
  },
  statLabel: {
    fontSize: '11px',
    color: '#444',
    letterSpacing: '1px',
  },
  section: {
    padding: '100px 40px',
    background: '#0a0a0a',
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  sectionBadge: {
    fontSize: '11px',
    color: '#00ff46',
    letterSpacing: '3px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '40px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    margin: '0 0 16px',
  },
  green: { color: '#00ff46' },
  sectionDesc: {
    color: '#555',
    fontSize: '14px',
    margin: '0 0 60px',
    lineHeight: '1.7',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    width: '100%',
  },
  featureCard: {
    background: '#0d1117',
    border: '1px solid',
    borderRadius: '12px',
    padding: '28px',
    textAlign: 'left',
    transition: 'all 0.2s',
    cursor: 'default',
  },
  featureIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '12px',
    color: '#555',
    lineHeight: '1.7',
  },
  stepsRow: {
    display: 'flex',
    gap: '0',
    alignItems: 'flex-start',
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  stepCard: {
    flex: 1,
    maxWidth: '280px',
    textAlign: 'center',
    padding: '32px 24px',
    position: 'relative',
    background: '#0a0a0a',
    border: '1px solid #00ff4615',
    borderRadius: '12px',
    margin: '0 10px',
  },
  stepNum: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#00ff4620',
    marginBottom: '16px',
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#00ff46',
    marginBottom: '12px',
  },
  stepDesc: {
    fontSize: '12px',
    color: '#555',
    lineHeight: '1.7',
  },
  stepArrow: {
    position: 'absolute',
    right: '-22px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#00ff4640',
    fontSize: '20px',
    zIndex: 1,
  },
  ctaBanner: {
    padding: '100px 40px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  ctaGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '300px',
    background: 'radial-gradient(ellipse, rgba(0,255,70,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  ctaTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    margin: 0,
    zIndex: 1,
  },
  ctaDesc: {
    color: '#555',
    fontSize: '14px',
    margin: 0,
    zIndex: 1,
  },
};