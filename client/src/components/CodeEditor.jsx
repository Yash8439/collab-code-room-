import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode, reviewCode } from '../api/execute';
import socket from '../socket';
import ReviewPanel from './ReviewPanel';
import UserPresence from './UserPresence';

const LANGUAGES = [
  { label: 'Python', value: 'python', icon: '🐍' },
  { label: 'JavaScript', value: 'javascript', icon: '🟨' },
  { label: 'Java', value: 'java', icon: '☕' },
  { label: 'C++', value: 'cpp', icon: '⚡' },
  { label: 'C', value: 'c', icon: '🔵' },
];

const DEFAULT_CODE = {
  python: '# CodeSync — Real-time Collaborative Editor\nprint("Hello, World!")',
  javascript: '// CodeSync — Real-time Collaborative Editor\nconsole.log("Hello, World!");',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  cpp: '#include<iostream>\nusing namespace std;\nint main(){\n  cout << "Hello, World!" << endl;\n  return 0;\n}',
  c: '#include<stdio.h>\nint main(){\n  printf("Hello, World!\\n");\n  return 0;\n}',
};

export default function CodeEditor({ roomId, username }) {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE['python']);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [userCount, setUserCount] = useState(1);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [review, setReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const isRemoteChange = useRef(false);
  const messagesEndRef = useRef(null);
  const [users, setUsers] = useState([]);
const [typingUsers, setTypingUsers] = useState([]);
const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.emit('join-room', { roomId, username });

    socket.on('room-joined', ({ code, language, users }) => {
      setCode(code);
      setLanguage(language);
      setUsers(users);
    });

    socket.on('code-update', (newCode) => {
      isRemoteChange.current = true;
      setCode(newCode);
    });

    socket.on('language-update', (newLang) => setLanguage(newLang));
    

    socket.on('user-joined', ({ username, userCount }) => {
      setUserCount(userCount);
      setMessages((prev) => [...prev, { system: true, text: `${username} joined the room` }]);
    });

    socket.on('user-left', ({ username, userCount }) => {
      setUserCount(userCount);
      setMessages((prev) => [...prev, { system: true, text: `${username} left the room` }]);
    });

     socket.on('users-updated', ({ users, newUser, leftUser }) => {
      setUsers(users);
      if (newUser) {
        setMessages((prev) => [...prev, { system: true, text: `${newUser} joined the room` }]);
      }
      if (leftUser) {
        setMessages((prev) => [...prev, { system: true, text: `${leftUser} left the room` }]);
        setTypingUsers((prev) => prev.filter((u) => u !== leftUser));
      }
    });

    socket.on('user-typing', ({ username, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping
          ? prev.includes(username) ? prev : [...prev, username]
          : prev.filter((u) => u !== username)
      );
    });

    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setActiveTab('chat');
    });

    return () => {
      socket.off('room-joined');
      socket.off('code-update');
      socket.off('language-update');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('chat-message');
      socket.off('users-updated');
socket.off('user-typing');
    };
  }, [roomId, username]);

  const handleCodeChange = (val) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      setCode(val);
      return;
    }
    setCode(val);
    socket.emit('code-change', { roomId, code: val });

    // Typing indicator
  socket.emit('typing-start', { roomId, username });
  clearTimeout(typingTimeoutRef.current);
  typingTimeoutRef.current = setTimeout(() => {
    socket.emit('typing-stop', { roomId, username });
  }, 1500);
};


  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    socket.emit('language-change', { roomId, language: lang });
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    setStatus(null);
    setActiveTab('output');
    try {
      const result = await executeCode(code, language);
      setStatus(result.status_id);
      setOutput(result.stdout || result.compile_output || result.stderr || 'No output');
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    setShowReview(true);
    setReviewLoading(true);
    setReview(null);
    try {
      const result = await reviewCode(code, language);
      setReview(result);
    } catch (err) {
      setReview({ error: err.message });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    socket.emit('chat-message', { roomId, message: chatInput, username });
    setChatInput('');
  };

  const currentLang = LANGUAGES.find((l) => l.value === language);

  return (
    <div style={s.root}>
      {/* ── TOP BAR ── */}
      <div style={s.topbar}>
        {/* Left — Logo */}
        <div style={s.topLeft}>
          <span style={s.logo}>{'</>'}</span>
          <span style={s.logoName}>CodeSync</span>
          <div style={s.roomBadge}>
            <span style={s.roomHash}>#</span>
            <span style={s.roomId}>{roomId}</span>
          </div>
        </div>

        {/* Center — Language Pills */}
        <div style={s.langPills}>
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => handleLanguageChange(l.value)}
              style={{
                ...s.langPill,
                background: language === l.value ? '#00ff4615' : 'transparent',
                border: `1px solid ${language === l.value ? '#00ff4660' : '#ffffff10'}`,
                color: language === l.value ? '#00ff46' : '#666',
              }}
            >
              {l.icon} {l.label}
            </button>
          ))}
        </div>

        {/* Right — Actions */}
        <div style={s.topRight}>
         <UserPresence
      users={users}
      typingUsers={typingUsers}
      currentUser={username}
    />
          <button
            onClick={handleReview}
            style={s.reviewBtn}
          >
            🤖 AI Review
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            style={{ ...s.runBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>⏳ Running...</>
            ) : (
              <>▶ Run</>
            )}
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={s.main}>
        {/* Editor */}
        <div style={s.editorPane}>
          {/* Editor Header */}
          <div style={s.editorHeader}>
            <span style={s.fileName}>
              main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'c'}
            </span>
            <span style={s.editorBadge}>{currentLang?.icon} {currentLang?.label}</span>
          </div>
          <Editor
            height="100%"
            language={language === 'cpp' || language === 'c' ? 'cpp' : language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              padding: { top: 16 },
            }}
          />
        </div>

        {/* Right Panel */}
        <div style={s.rightPane}>
          {/* Tabs */}
          <div style={s.tabs}>
            {['output', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...s.tab,
                  borderBottom: activeTab === tab ? '2px solid #00ff46' : '2px solid transparent',
                  color: activeTab === tab ? '#00ff46' : '#555',
                }}
              >
                {tab === 'output' ? '⚡ Output' : `💬 Chat${messages.filter(m => !m.system).length > 0 ? ` (${messages.filter(m => !m.system).length})` : ''}`}
              </button>
            ))}
          </div>

          {/* Output Tab */}
          {activeTab === 'output' && (
            <div style={s.outputPane}>
              {/* Status bar */}
              {status && (
                <div style={{
                  ...s.statusBar,
                  background: status === 3 ? '#00ff4610' : '#ff444410',
                  borderBottom: `1px solid ${status === 3 ? '#00ff4630' : '#ff444430'}`,
                }}>
                  <span style={{ color: status === 3 ? '#00ff46' : '#ff4444' }}>
                    {status === 3 ? '✓ Accepted' : '✗ Error'}
                  </span>
                </div>
              )}
              <pre style={s.outputBox}>
                {loading
                  ? '⏳ Executing...'
                  : output || '// Run your code to see output here'}
              </pre>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div style={s.chatPane}>
              <div style={s.messages}>
                {messages.length === 0 && (
                  <div style={s.emptyChat}>No messages yet. Say hi! 👋</div>
                )}
                {messages.map((msg, i) =>
                  msg.system ? (
                    <div key={i} style={s.systemMsg}>— {msg.text} —</div>
                  ) : (
                    <div key={i} style={{
                      ...s.msgBubble,
                      alignSelf: msg.username === username ? 'flex-end' : 'flex-start',
                    }}>
                      {msg.username !== username && (
                        <div style={s.msgUser}>{msg.username}</div>
                      )}
                      <div style={{
                        ...s.msgText,
                        background: msg.username === username ? '#00ff4620' : '#ffffff08',
                        border: `1px solid ${msg.username === username ? '#00ff4640' : '#ffffff10'}`,
                      }}>
                        {msg.message}
                      </div>
                      <div style={s.msgTime}>{msg.time}</div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
              <div style={s.chatInputRow}>
                <input
                  style={s.chatInput}
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button style={s.sendBtn} onClick={handleSendMessage}>
                  ➤
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Panel */}
      {showReview && (
        <ReviewPanel
          review={review}
          loading={reviewLoading}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#0a0a0a',
    color: '#e6edf3',
    fontFamily: "'Fira Code', 'Courier New', monospace",
    overflow: 'hidden',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '52px',
    background: '#0d1117',
    borderBottom: '1px solid #00ff4615',
    gap: '16px',
    flexShrink: 0,
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '180px',
  },
  logo: {
    color: '#00ff46',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  logoName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  roomBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: '#00ff4610',
    border: '1px solid #00ff4630',
    borderRadius: '6px',
    padding: '3px 8px',
  },
  roomHash: { color: '#00ff46', fontSize: '12px' },
  roomId: { color: '#00ff46', fontSize: '12px', fontWeight: 'bold' },
  langPills: {
    display: 'flex',
    gap: '6px',
    flex: 1,
    justifyContent: 'center',
  },
  langPill: {
    padding: '5px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: "'Fira Code', monospace",
    transition: 'all 0.2s',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '220px',
    justifyContent: 'flex-end',
  },
  onlineBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  onlineDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#00ff46',
    boxShadow: '0 0 6px #00ff46',
  },
  onlineText: {
    fontSize: '12px',
    color: '#555',
  },
  reviewBtn: {
    padding: '7px 14px',
    borderRadius: '8px',
    border: '1px solid #9b59b640',
    background: '#9b59b610',
    color: '#9b59b6',
    fontSize: '12px',
    fontFamily: "'Fira Code', monospace",
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  runBtn: {
    padding: '7px 18px',
    borderRadius: '8px',
    border: 'none',
    background: '#00ff46',
    color: '#0a0a0a',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: "'Fira Code', monospace",
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  editorPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRight: '1px solid #00ff4615',
  },
  editorHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: '#0d1117',
    borderBottom: '1px solid #ffffff08',
    flexShrink: 0,
  },
  fileName: {
    fontSize: '12px',
    color: '#555',
  },
  editorBadge: {
    fontSize: '11px',
    color: '#00ff46',
    background: '#00ff4610',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  rightPane: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    background: '#0d1117',
    flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #ffffff08',
    flexShrink: 0,
  },
  tab: {
    flex: 1,
    padding: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: "'Fira Code', monospace",
    transition: 'all 0.2s',
  },
  outputPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  statusBar: {
    padding: '8px 16px',
    fontSize: '12px',
    flexShrink: 0,
  },
  outputBox: {
    flex: 1,
    padding: '16px',
    margin: 0,
    overflow: 'auto',
    fontSize: '13px',
    color: '#00ff46',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
  },
  chatPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    padding: '12px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emptyChat: {
    textAlign: 'center',
    color: '#333',
    fontSize: '12px',
    marginTop: '40px',
  },
  systemMsg: {
    textAlign: 'center',
    color: '#333',
    fontSize: '11px',
    fontStyle: 'italic',
  },
  msgBubble: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxWidth: '85%',
  },
  msgUser: {
    fontSize: '10px',
    color: '#00ff46',
    paddingLeft: '4px',
  },
  msgText: {
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#e6edf3',
    lineHeight: '1.4',
  },
  msgTime: {
    fontSize: '10px',
    color: '#333',
    paddingLeft: '4px',
  },
  chatInputRow: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    borderTop: '1px solid #ffffff08',
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #ffffff10',
    background: '#161b22',
    color: '#e6edf3',
    fontSize: '13px',
    fontFamily: "'Fira Code', monospace",
    outline: 'none',
  },
  sendBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    background: '#00ff46',
    color: '#0a0a0a',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
};