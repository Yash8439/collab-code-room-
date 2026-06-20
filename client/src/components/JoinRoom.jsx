import { useState } from 'react';

export default function JoinRoom({ onJoin }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [hovering, setHovering] = useState('');

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  const handleJoin = () => {
    if (!username.trim() || !roomId.trim()) return;
    onJoin({ username, roomId });
  };

  return (
    <div style={styles.bg}>
      {/* Matrix rain effect */}
      <div style={styles.matrixOverlay} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>{'</>'}</span>
          <span style={styles.logoText}>CodeSync</span>
        </div>
        <p style={styles.tagline}>Real-time collaborative coding</p>

        <div style={styles.divider} />

        {/* Username */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>YOUR NAME</label>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>👤</span>
            <input
              style={styles.input}
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>
        </div>

        {/* Room ID */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>ROOM ID</label>
          <div style={styles.roomRow}>
            <div style={{ ...styles.inputWrapper, flex: 1 }}>
              <span style={styles.inputIcon}>#</span>
              <input
                style={styles.input}
                placeholder="Enter room ID..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>
            <button
              style={{
                ...styles.genBtn,
                background: hovering === 'gen' ? '#1a3a1a' : 'transparent',
              }}
              onClick={generateRoomId}
              onMouseEnter={() => setHovering('gen')}
              onMouseLeave={() => setHovering('')}
            >
              Generate
            </button>
          </div>
        </div>

        {/* Join Button */}
        <button
          style={{
            ...styles.joinBtn,
            opacity: username && roomId ? 1 : 0.5,
            transform: hovering === 'join' ? 'translateY(-2px)' : 'none',
            boxShadow: hovering === 'join' ? '0 0 20px rgba(0,255,70,0.4)' : '0 0 10px rgba(0,255,70,0.2)',
          }}
          onClick={handleJoin}
          onMouseEnter={() => setHovering('join')}
          onMouseLeave={() => setHovering('')}
        >
          <span>Enter Room</span>
          <span style={{ fontSize: '18px' }}>→</span>
        </button>

        {/* Features */}
        <div style={styles.features}>
          {['⚡ Real-time sync', '🤖 AI Review', '▶ Multi-language', '💬 Live Chat'].map((f) => (
            <span key={f} style={styles.featureTag}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    height: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Fira Code', 'Courier New', monospace",
    position: 'relative',
    overflow: 'hidden',
  },
  matrixOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, rgba(0,255,70,0.03) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#0d1117',
    border: '1px solid #00ff4620',
    borderRadius: '16px',
    padding: '40px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0 0 40px rgba(0,255,70,0.08), 0 20px 60px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 1,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: '28px',
    color: '#00ff46',
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '1px',
  },
  tagline: {
    color: '#4a4a4a',
    fontSize: '13px',
    textAlign: 'center',
    margin: 0,
    letterSpacing: '1px',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(to right, transparent, #00ff4630, transparent)',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '10px',
    color: '#00ff46',
    letterSpacing: '2px',
    fontWeight: 'bold',
  },
  roomRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#161b22',
    border: '1px solid #21262d',
    borderRadius: '8px',
    padding: '0 12px',
    transition: 'border-color 0.2s',
  },
  inputIcon: {
    fontSize: '14px',
    marginRight: '8px',
    color: '#4a4a4a',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e6edf3',
    fontSize: '14px',
    padding: '12px 0',
    fontFamily: "'Fira Code', monospace",
  },
  genBtn: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #00ff4640',
    color: '#00ff46',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: "'Fira Code', monospace",
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  joinBtn: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    background: '#00ff46',
    color: '#0a0a0a',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: "'Fira Code', monospace",
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '4px',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  featureTag: {
    fontSize: '11px',
    color: '#4a4a4a',
    background: '#161b22',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid #21262d',
  },
};