const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language required' });
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert code reviewer. Always respond in this exact JSON format only, no extra text:
{
  "bugs": ["bug1", "bug2"],
  "logic_mistakes": ["mistake1"],
  "time_complexity": "O(n)",
  "space_complexity": "O(1)",
  "code_smells": ["smell1"],
  "better_approach": "explanation here",
  "overall_rating": 7
}`,
          },
          {
            role: 'user',
            content: `Review this ${language} code:\n\n${code}`,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const review = JSON.parse(cleaned);

    res.json(review);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'AI review failed' });
  }
});

module.exports = router;