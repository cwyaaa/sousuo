const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 后端 API 路由处理
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.messages[0].content;

  if (!userMessage) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 1024,
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.cwy_open_ai}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data;
    res.json(aiResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI请求失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
