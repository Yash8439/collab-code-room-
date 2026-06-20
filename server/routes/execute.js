const express = require('express');
const router = express.Router();
const axios = require('axios');
const Room = require('../models/Room');

const JUDGE0_URL = 'https://ce.judge0.com';

const LANGUAGE_IDS = {
  javascript: 102,
  python: 109,
  java: 91,
  cpp: 105,
  c: 110,
};

router.post('/', async (req, res) => {
  const { code, language, stdin = '' } = req.body;

  const language_id = LANGUAGE_IDS[language];
  if (!language_id) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  try {
    // Step 1: Submit
    const submitRes = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      { source_code: code, language_id, stdin },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const token = submitRes.data.token;

    // Step 2: Poll for result
    let result;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1000));

      const pollRes = await axios.get(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false&fields=*`
      );

      result = pollRes.data;
      if (result.status_id > 2) break; // done
    }

    res.json({
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      status: result.status.description,
      status_id: result.status_id,
      time: result.time,
      memory: result.memory,
    });

    // History save karo
    if (req.body.roomId) {
      try {
        await Room.findOneAndUpdate(
          { roomId: req.body.roomId },
          {
            $push: {
              executionHistory: {
                $each: [{
                  code: req.body.code,
                  language: req.body.language,
                  output: result.stdout || result.compile_output || '',
                  status: result.status.description,
                }],
                $slice: -10,
              },
            },
          },
          { upsert: true }
        );
      } catch (e) {
        console.error('History save error:', e.message);
      }
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Execution failed' });
  }
});

module.exports = router;