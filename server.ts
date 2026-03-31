import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/contact', async (req, res) => {
    const { name, phone, service, recaptchaToken } = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!token || !chatId || token === 'YOUR_BOT_TOKEN' || chatId === 'YOUR_CHAT_ID') {
      return res.status(500).json({ error: 'Telegram configuration missing' });
    }

    if (!secretKey || secretKey === 'YOUR_RECAPTCHA_SECRET_KEY') {
      return res.status(500).json({ error: 'reCAPTCHA configuration missing' });
    }

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${recaptchaToken}`
    });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }

    const message = `
🚀 *YÊU CẦU MỚI TỪ LANDING PAGE*
👤 Tên: ${name}
📞 SĐT: ${phone}
🛠 Dịch vụ: ${service}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        res.json({ success: true });
      } else {
        const errorData = await response.json();
        console.error('Telegram API Error:', errorData);
        res.status(500).json({ error: 'Failed to send message to Telegram' });
      }
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
