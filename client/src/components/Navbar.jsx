import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [hovering, setHovering] = useState('');

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logoLink}>
        <span style={s.logoIcon}>{'</>'}</span>
        <span style={s.logoText}>CodeSync</span>
      </Link>

      <div style={s.links}>
        <a href="/" style={{ ...s.link, color: hovering === 'Home' ? '#00ff46' : '#666' }} onMouseEnter={() => setHovering('Home')} onMouseLeave={() => setHovering('')}>Home</a>
        <a href="/#features" style={{ ...s.link, color: hovering === 'Features' ? '#00ff46' : '#666' }} onMouseEnter={() => setHovering('Features')} onMouseLeave={() => setHovering('')}>Features</a>
        <a href="/#about" style={{ ...s.link, color: hovering === 'About' ? '#00ff46' : '#666' }} onMouseEnter={() => setHovering('About')} onMouseLeave={() => setHovering('')}>About</a>
      </div>

      <div style={s.actions}>
        <Link to="/room" style={{ ...s.outlineBtn, borderColor: hovering === 'join' ? '#00ff46' : '#00ff4640', color: hovering === 'join' ? '#00ff46' : '#555' }} onMouseEnter={() => setHovering('join')} onMouseLeave={() => setHovering('')}>
          Join Room
        </Link>
        <Link to="/room" style={{ ...s.solidBtn, boxShadow: hovering === 'start' ? '0 0 20px rgba(0,255,70,0.3)' : '0 0 10px rgba(0,255,70,0.1)' }} onMouseEnter={() => setHovering('start')} onMouseLeave={() => setHovering('')}>
          Start Coding →
        </Link>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '60px',
    background: 'rgba(10,10,10,0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #00ff4615',
    fontFamily: "'Fira Code', monospace",
  },
  logoLink: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoIcon: { color: '#00ff46', fontWeight: 'bold', fontSize: '20px' },
  logoText: { color: '#fff', fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' },
  links: { display: 'flex', gap: '32px', alignItems: 'center' },
  link: { textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s', cursor: 'pointer' },
  actions: { display: 'flex', gap: '10px', alignItems: 'center' },
  outlineBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid',
    background: 'transparent',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Fira Code', monospace",
  },
  solidBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    background: '#00ff46',
    color: '#0a0a0a',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Fira Code', monospace",
  },
};