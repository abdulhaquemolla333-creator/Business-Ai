require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

const SYSTEM_PROMPT =
  "You are Business AI, an expert small-business consultant covering pricing, business plans, " +
  "marketing, cash flow, hiring, and daily operations. Give concrete, specific, well-structured " +
  "advice (numbers, steps, short frameworks) rather than generic tips — ask one clarifying " +
  "question only when it's truly needed, otherwise make a reasonable assumption and say so. " +
  "Use the local currency the user is talking in. Keep answers focused and practical, formatted " +
  "with short paragraphs or numbered steps where that helps.";

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/chat', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. Set it in .env.' });
    }

    const { turns, image } = req.body;
    if (!Array.isArray(turns) || turns.length === 0) {
      return res.status(400).json({ error: 'turns array is required' });
    }

    // Build the Anthropic messages array. The last user turn gets the image, if one was sent.
    const messages = turns.map((t, i) => {
      const isLast = i === turns.length - 1;
      if (isLast && image) {
        const match = image.match(/^data:(.+);base64,(.+)$/);
        const mediaType = match ? match[1] : 'image/jpeg';
        const data = match ? match[2] : image;
        return {
          role: t.role,
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
            { type: 'text', text: t.content || 'Please look at this image and help me with it.' }
          ]
        };
      }
      return { role: t.role, content: t.content };
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Anthropic API error:', data.error || data);
      return res.status(502).json({ error: (data.error && data.error.message) || 'Anthropic API error' });
    }

    const text = (data.content || [])
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n')
      .trim();

    res.json({ text: text || "I couldn't come up with an answer — try rephrasing your question." });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error, please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Business AI backend running on port ${PORT}`));
