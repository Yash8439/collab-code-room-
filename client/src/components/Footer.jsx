export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        {/* Brand */}
        <div style={s.brand}>
          <div style={s.logoRow}>
            <span style={s.logoIcon}>{'</>'}</span>
            <span style={s.logoText}>CodeSync</span>
          </div>
          <p style={s.tagline}>
            Real-time collaborative coding platform.<br />
            Code together, anywhere.
          </p>
          <div style={s.socialRow}>
            {['GitHub', 'LinkedIn', 'Twitter'].map((s_) => (
              <a key={s_} href="#" style={s.socialLink}>{s_}</a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={s.linksSection}>
          <div style={s.linkGroup}>
            <div style={s.groupTitle}>Product</div>
            {['Features', 'Room Editor', 'AI Review', 'Code Execution'].map((l) => (
              <a key={l} href="#" style={s.footerLink}>{l}</a>
            ))}
          </div>
          <div style={s.linkGroup}>
            <div style={s.groupTitle}>Tech Stack</div>
            {['React + Vite', 'Node.js', 'Socket.io', 'MongoDB'].map((l) => (
              <a key={l} href="#" style={s.footerLink}>{l}</a>
            ))}
          </div>
          <div style={s.linkGroup}>
            <div style={s.groupTitle}>Developer</div>
            {['GitHub Repo', 'Documentation', 'API Docs', 'Changelog'].map((l) => (
              <a key={l} href="#" style={s.footerLink}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={s.bottom}>
        <div style={s.divider} />
        <div style={s.bottomInner}>
          <span style={s.copy}>
            © 2025 CodeSync. Built with
            <span style={{ color: '#00ff46' }}> ♥ </span>
            by Yash
          </span>
          <div style={s.techBadges}>
            {['React', 'Socket.io', 'Judge0', 'Groq AI'].map((tech) => (
              <span key={tech} style={s.techBadge}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const s = {
  footer: {
    background: '#0d1117',
    borderTop: '1px solid #00ff4615',
    fontFamily: "'Fira Code', monospace",
    marginTop: 'auto',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '60px 40px 40px',
    display: 'flex',
    gap: '80px',
  },
  brand: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    color: '#00ff46',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  tagline: {
    color: '#555',
    fontSize: '13px',
    lineHeight: '1.7',
    margin: 0,
  },
  socialRow: {
    display: 'flex',
    gap: '16px',
  },
  socialLink: {
    color: '#555',
    fontSize: '12px',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  linksSection: {
    display: 'flex',
    gap: '60px',
  },
  linkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  groupTitle: {
    color: '#00ff46',
    fontSize: '11px',
    letterSpacing: '2px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  footerLink: {
    color: '#555',
    fontSize: '13px',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  bottom: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 40px 30px',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(to right, transparent, #00ff4620, transparent)',
    marginBottom: '24px',
  },
  bottomInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copy: {
    color: '#333',
    fontSize: '12px',
  },
  techBadges: {
    display: 'flex',
    gap: '8px',
  },
  techBadge: {
    fontSize: '11px',
    color: '#00ff46',
    background: '#00ff4610',
    border: '1px solid #00ff4620',
    padding: '3px 10px',
    borderRadius: '20px',
  },
};