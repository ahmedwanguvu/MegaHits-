const express = require('express');
const axios = require('axios');

const router = express.Router();

// POST /api/ai/summarize  { text: "..." }
router.post('/summarize', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: true, message: 'Missing "text" in request body' });

    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Summarize the given text in 3 concise sentences.' },
          { role: 'user', content: text },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );
    res.json({ summary: data.choices[0].message.content });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/translate  { text: "...", target: "sw" }
router.post('/translate', async (req, res, next) => {
  try {
    const { text, target = 'sw' } = req.body;
    if (!text) return res.status(400).json({ error: true, message: 'Missing "text" in request body' });

    const { data } = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      new URLSearchParams({ text, target_lang: target.toUpperCase() }),
      { headers: { Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}` } }
    );
    res.json({ translation: data.translations[0].text });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
