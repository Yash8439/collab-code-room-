const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const Room = require('./models/Room');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use('/api/execute', require('./routes/execute'));
app.use('/api/review', require('./routes/review'));
app.use('/api/rooms', require('./routes/rooms'));

const rooms = {};

const USER_COLORS = [
  '#00ff46', '#ff6b6b', '#4ecdc4', '#ffe66d',
  '#a29bfe', '#fd79a8', '#74b9ff', '#55efc4',
];

const getAvatar = (username) => username.slice(0, 2).toUpperCase();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // ── Join Room ──
  socket.on('join-room', async ({ roomId, username }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;

    if (!rooms[roomId]) {
      rooms[roomId] = {
        code: '# Start coding here...',
        language: 'python',
        users: new Map(),
      };
    }

    // MongoDB se saved code load karo
    try {
      let dbRoom = await Room.findOne({ roomId });
      if (dbRoom) {
        rooms[roomId].code = dbRoom.code;
        rooms[roomId].language = dbRoom.language;
      } else {
        await Room.create({ roomId });
      }
    } catch (err) {
      console.error('DB error on join:', err.message);
    }

    const colorIndex = rooms[roomId].users.size % USER_COLORS.length;
    const userInfo = {
      username,
      avatar: getAvatar(username),
      color: USER_COLORS[colorIndex],
      socketId: socket.id,
    };

    rooms[roomId].users.set(socket.id, userInfo);

    socket.emit('room-joined', {
      code: rooms[roomId].code,
      language: rooms[roomId].language,
      users: Array.from(rooms[roomId].users.values()),
    });

    socket.to(roomId).emit('users-updated', {
      users: Array.from(rooms[roomId].users.values()),
      newUser: username,
    });

    console.log(`${username} joined room ${roomId}`);
  });

  // ── Code Change ──
  socket.on('code-change', async ({ roomId, code }) => {
    if (rooms[roomId]) rooms[roomId].code = code;
    socket.to(roomId).emit('code-update', code);

    // Debounced save — 2 sec baad MongoDB mein save
    clearTimeout(rooms[roomId]?.saveTimeout);
    if (rooms[roomId]) {
      rooms[roomId].saveTimeout = setTimeout(async () => {
        try {
          await Room.findOneAndUpdate(
            { roomId },
            { code, lastActive: Date.now() },
            { upsert: true }
          );
        } catch (err) {
          console.error('Save error:', err.message);
        }
      }, 2000);
    }
  });

  // ── Language Change ──
  socket.on('language-change', async ({ roomId, language }) => {
    if (rooms[roomId]) rooms[roomId].language = language;
    socket.to(roomId).emit('language-update', language);

    try {
      await Room.findOneAndUpdate(
        { roomId },
        { language },
        { upsert: true }
      );
    } catch (err) {
      console.error('Language save error:', err.message);
    }
  });

  // ── Typing ──
  socket.on('typing-start', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', { username, isTyping: true });
  });

  socket.on('typing-stop', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', { username, isTyping: false });
  });

  // ── Chat ──
  socket.on('chat-message', async ({ roomId, message, username }) => {
    const time = new Date().toLocaleTimeString();

    io.to(roomId).emit('chat-message', { username, message, time });

    try {
      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: {
            messages: {
              $each: [{ username, message, time }],
              $slice: -50,
            },
          },
        },
        { upsert: true }
      );
    } catch (err) {
      console.error('Chat save error:', err.message);
    }
  });

  // ── Disconnect ──
  socket.on('disconnect', () => {
    const { roomId, username } = socket;
    if (roomId && rooms[roomId]) {
      rooms[roomId].users.delete(socket.id);

      socket.to(roomId).emit('users-updated', {
        users: Array.from(rooms[roomId].users.values()),
        leftUser: username,
      });

      if (rooms[roomId].users.size === 0) {
        clearTimeout(rooms[roomId]?.saveTimeout);
        delete rooms[roomId];
      }
    }
    console.log('Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));