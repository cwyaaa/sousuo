// /api/chat.js
export default async function handler(req, res) {
  const apiKey = process.env.cwyopenai;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: req.body.messages,
      max_tokens: 1024,
      temperature: 0.6
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
