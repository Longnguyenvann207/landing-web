import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI(process.env.GEMINI_API_KEY as any) : null;

  // API Routes
  app.post('/api/chat', async (req, res) => {
    if (!genAI) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const { message, history } = req.body;
    
    try {
      const model = (genAI as any).getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are Sky Luxury Media's AI assistant. You help customers with social media services (unlocking FB/TikTok, seeding, MMO tools). Be professional, elite, and helpful. Keep answers concise. If asked about prices, refer to the pricing section. If asked for direct support, suggest Zalo or the contact form."
      });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    const { name, phone, service } = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || token === 'YOUR_BOT_TOKEN' || chatId === 'YOUR_CHAT_ID') {
      console.warn('Telegram configuration missing. Message will not be sent.');
      // Return success to user anyway to avoid confusing them if they forgot to set env vars
      return res.json({ success: true, warning: 'Telegram config missing' });
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
