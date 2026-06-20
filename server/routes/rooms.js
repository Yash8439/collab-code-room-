const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Room get karo ya banao
router.get('/:roomId', async (req, res) => {
  try {
    let room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      room = await Room.create({ roomId: req.params.roomId });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Code save karo
router.patch('/:roomId/code', async (req, res) => {
  try {
    const { code, language } = req.body;
    const room = await Room.findOneAndUpdate(
      { roomId: req.params.roomId },
      { code, language, lastActive: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ success: true, code: room.code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execution history save karo
router.post('/:roomId/execution', async (req, res) => {
  try {
    const { code, language, output, status } = req.body;
    const room = await Room.findOneAndUpdate(
      { roomId: req.params.roomId },
      {
        $push: {
          executionHistory: {
            $each: [{ code, language, output, status }],
            $slice: -10, // last 10 runs save karo
          },
        },
        lastActive: Date.now(),
      },
      { new: true, upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat message save karo
router.post('/:roomId/message', async (req, res) => {
  try {
    const { username, message, time } = req.body;
    await Room.findOneAndUpdate(
      { roomId: req.params.roomId },
      {
        $push: {
          messages: {
            $each: [{ username, message, time }],
            $slice: -50, // last 50 messages
          },
        },
      },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;