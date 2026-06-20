export default function ReviewPanel({ review, loading, onClose }) {
  if (loading) {
    return (
      <div style={s.overlay}>
        <div style={s.panel}>
          <div style={s.loadingBox}>
            <div style={s.spinnerRing} />
            <p style={s.loadingText}>Analyzing your code...</p>
            <p style={s.loadingSubText}>AI is reviewing bugs, complexity & improvements</p>
          </div>
        </div>
      </div>
    );
  }

  if (!review) return null;

  const rating = review.overall_rating || 0;
  const ratingColor = rating >= 8 ? '#00ff46' : rating >= 5 ? '#f39c12' : '#ff4444';

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <span style={s.headerIcon}>🤖</span>
            <span style={s.headerTitle}>AI Code Review</span>
          </div>
          <div style={s.headerRight}>
            <div style={s.ratingCircle}>
              <span style={{ ...s.ratingNum, color: ratingColor }}>{rating}</span>
              <span style={s.ratingDen}>/10</span>
            </div>
            <button style={s.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={s.body}>
          {/* Complexity Cards */}
          <div style={s.complexityRow}>
            <div style={s.complexCard}>
              <div style={s.complexIcon}>⏱</div>
              <div style={s.complexLabel}>Time Complexity</div>
              <div style={s.complexValue}>{review.time_complexity || 'N/A'}</div>
            </div>
            <div style={s.complexCard}>
              <div style={s.complexIcon}>💾</div>
              <div style={s.complexLabel}>Space Complexity</div>
              <div style={s.complexValue}>{review.space_complexity || 'N/A'}</div>
            </div>
          </div>

          {/* Bugs */}
          {review.bugs?.length > 0 && (
            <ReviewSection
              title="🐛 Bugs Found"
              items={review.bugs}
              accentColor="#ff4444"
              bgColor="#ff44440a"
              borderColor="#ff444420"
            />
          )}

          {/* Logic Mistakes */}
          {review.logic_mistakes?.length > 0 && (
            <ReviewSection
              title="⚠️ Logic Mistakes"
              items={review.logic_mistakes}
              accentColor="#f39c12"
              bgColor="#f39c120a"
              borderColor="#f39c1220"
            />
          )}

          {/* Code Smells */}
          {review.code_smells?.length > 0 && (
            <ReviewSection
              title="👃 Code Smells"
              items={review.code_smells}
              accentColor="#9b59b6"
              bgColor="#9b59b60a"
              borderColor="#9b59b620"
            />
          )}

          {/* Better Approach */}
          {review.better_approach && (
            <div style={s.betterBox}>
              <div style={s.betterTitle}>💡 Better Approach</div>
              <p style={s.betterText}>{review.better_approach}</p>
            </div>
          )}

          {/* No issues */}
          {!review.bugs?.length && !review.logic_mistakes?.length && !review.code_smells?.length && (
            <div style={s.allGood}>
              <span style={{ fontSize: '32px' }}>✨</span>
              <p style={{ color: '#00ff46', margin: 0 }}>Clean code! No issues found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, items, accentColor, bgColor, borderColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: accentColor, letterSpacing: '1px' }}>
        {title}
      </div>
      <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#c9d1d9', lineHeight: '1.5' }}>
            <span style={{ color: accentColor, flexShrink: 0 }}>▸</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const inject = document.createElement('style');
inject.innerHTML = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
`;
document.head.appendChild(inject);

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: "'Fira Code', monospace",
  },
  panel: {
    background: '#0d1117',
    border: '1px solid #00ff4620',
    borderRadius: '16px',
    width: '560px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 0 40px rgba(0,255,70,0.08), 0 20px 60px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: '#161b22',
    borderBottom: '1px solid #00ff4615',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerIcon: { fontSize: '20px' },
  headerTitle: { fontSize: '16px', fontWeight: 'bold', color: '#e6edf3' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  ratingCircle: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
    background: '#0d1117',
    border: '1px solid #00ff4630',
    borderRadius: '8px',
    padding: '4px 12px',
  },
  ratingNum: { fontSize: '22px', fontWeight: 'bold' },
  ratingDen: { fontSize: '12px', color: '#555' },
  closeBtn: {
    background: 'none',
    border: '1px solid #ffffff10',
    color: '#555',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '6px',
    padding: '4px 8px',
    transition: 'all 0.2s',
  },
  body: {
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  complexityRow: { display: 'flex', gap: '12px' },
  complexCard: {
    flex: 1,
    background: '#161b22',
    border: '1px solid #00ff4615',
    borderRadius: '10px',
    padding: '14px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  complexIcon: { fontSize: '20px' },
  complexLabel: { fontSize: '10px', color: '#555', letterSpacing: '1px' },
  complexValue: { fontSize: '20px', fontWeight: 'bold', color: '#00ff46' },
  betterBox: {
    background: '#00ff4608',
    border: '1px solid #00ff4620',
    borderRadius: '8px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  betterTitle: { fontSize: '12px', fontWeight: 'bold', color: '#00ff46', letterSpacing: '1px' },
  betterText: { fontSize: '13px', color: '#c9d1d9', margin: 0, lineHeight: '1.7' },
  allGood: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '30px',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 40px',
    gap: '16px',
  },
  spinnerRing: {
    width: '48px',
    height: '48px',
    border: '3px solid #00ff4620',
    borderTop: '3px solid #00ff46',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#00ff46',
    fontSize: '16px',
    margin: 0,
    fontWeight: 'bold',
  },
  loadingSubText: {
    color: '#555',
    fontSize: '12px',
    margin: 0,
    textAlign: 'center',
  },
};