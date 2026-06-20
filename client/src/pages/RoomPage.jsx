import { useState } from 'react';
import JoinRoom from '../components/JoinRoom';
import CodeEditor from '../components/CodeEditor';

export default function RoomPage() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <JoinRoom onJoin={setSession} />;
  }

  return <CodeEditor roomId={session.roomId} username={session.username} />;
}