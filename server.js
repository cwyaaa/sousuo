// 加载本地环境变量（本地开发时有用，Vercel部署时不会影响）
require('dotenv').config();

const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000; // 支持 Vercel 动态端口，也支持本地默认3000

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 自动读取，无需手动填key
});

// 中间件：允许解析 JSON 请求
app.use(express.json());

// 简单根路由，防止访问 "/" 报错
app.get('/', (req, res) => {
  res.send('🚀 Server is up and running!');
});

// AI 搜索接口
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.messages?.[0]?.content; // 防止出错，加了保护

  if (!userMessage) {
    return res.status(400).json({ error: '缺少用户消息内容。' });
  }

  try {
    // 调用 OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 1024,
      temperature: 0.6,
    });

    // 返回 AI 的回复
    res.json({
      choices: [
        {
          message: response.choices[0].message,
        },
      ],
    });
  } catch (error) {
    console.error('❌ OpenAI API 请求失败：', error.message);
    res.status(500).json({ error: 'AI 搜索失败，请检查 API 配置或网络连接。' });
  }
});

// 启动服务器（本地开发时用）
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Local server running at http://localhost:${port}`);
  });
}

// 注意：Vercel部署时，不需要 app.listen，Vercel自己处理
module.exports = app; // Vercel识别这个出口
