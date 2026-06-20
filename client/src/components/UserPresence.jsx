import { useState } from 'react';

export default function UserPresence({ users, typingUsers, currentUser }) {
  const [hoveredUser, setHoveredUser] = useState(null);

  return (
    <div style={s.wrapper}>
      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div style={s.typingBadge}>
          <div style={s.typingDots}>
            <span style={s.dot} />
            <span style={{ ...s.dot, animationDelay: '0.2s' }} />
            <span style={{ ...s.dot, animationDelay: '0.4s' }} />
          </div>
          <span style={s.typingText}>
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing`
              : `${typingUsers.length} people typing`}
          </span>
        </div>
      )}

      {/* User Avatars */}
      <div style={s.avatarRow}>
        {users.map((user, i) => (
          <div
            key={user.socketId}
            style={{ position: 'relative', zIndex: users.length - i }}
            onMouseEnter={() => setHoveredUser(user.socketId)}
            onMouseLeave={() => setHoveredUser(null)}
          >
            {/* Avatar */}
            <div
              style={{
                ...s.avatar,
                background: user.color + '20',
                border: `2px solid ${user.color}`,
                marginLeft: i > 0 ? '-8px' : '0',
                boxShadow: `0 0 8px ${user.color}40`,
              }}
            >
              <span style={{ ...s.avatarText, color: user.color }}>
                {user.avatar}
              </span>

              {/* Online dot */}
              <div style={{ ...s.onlineDot, background: user.color }} />
            </div>

            {/* Tooltip */}
            {hoveredUser === user.socketId && (
              <div style={s.tooltip}>
                <span style={{ color: user.color }}>{user.username}</span>
                {user.username === currentUser && (
                  <span style={s.youBadge}>you</span>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Count badge agar 4 se zyada users */}
        {users.length > 4 && (
          <div style={{ ...s.avatar, marginLeft: '-8px', background: '#ffffff10', border: '2px solid #ffffff20' }}>
            <span style={{ ...s.avatarText, color: '#888', fontSize: '10px' }}>
              +{users.length - 4}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Inject animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes typingBounce {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50% { transform: translateY(-4px); opacity: 1; }
  }
`;
document.head.appendChild(style);

const s = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  typingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#00ff4610',
    border: '1px solid #00ff4625',
    borderRadius: '20px',
    padding: '4px 10px',
  },
  typingDots: {
    display: 'flex',
    gap: '3px',
    alignItems: 'center',
  },
  dot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#00ff46',
    display: 'inline-block',
    animation: 'typingBounce 0.8s ease infinite',
  },
  typingText: {
    fontSize: '11px',
    color: '#00ff46',
    whiteSpace: 'nowrap',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.2s',
  },
  avatarText: {
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: "'Fira Code', monospace",
  },
  onlineDot: {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '1.5px solid #0a0a0a',
  },
  tooltip: {
    position: 'absolute',
    top: '38px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#161b22',
    border: '1px solid #00ff4630',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '11px',
    whiteSpace: 'nowrap',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  youBadge: {
    fontSize: '9px',
    color: '#555',
    background: '#ffffff10',
    padding: '1px 5px',
    borderRadius: '4px',
  },
};