import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Enable CORS for PWA testing tools (e.g. PWABuilder), cross-origin bots, and API clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize GoogleGenAI server-side with required User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Islamic Assistant Endpoint
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { question, language = 'en', topicContext = '' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: 'AI service is temporarily unconfigured. Please verify GEMINI_API_KEY in the Secrets panel.',
      });
    }

    const systemInstruction = `You are the authentic AI Islamic Companion assistant within the DEEN application.
Your mission is to help Muslims discover and understand Islamic educational resources, terminology, Quranic contexts, and Hadith summaries with genuine reverence and accuracy.

CRITICAL RELIGIOUS INTEGRITY RULES:
1. NEVER fabricate or misattribute Quranic verses, Hadiths, Arabic text, chains of transmission, or authenticity gradings.
2. Every Quran quote must include the exact Surah Name and Verse Number (e.g. Surah Al-Baqarah 2:255).
3. Every Hadith summary or quote must specify the recognized collection and number when known (e.g. Sahih al-Bukhari #1, Sahih Muslim #2564, Jami' at-Tirmidhi #2317) and scholarly grading (Sahih, Hasan).
4. Clearly separate:
   - [Original Scripture / Hadith Text & Translation]
   - [Scholarly Tafsir / Context]
   - [Educational Explanation]
5. If a topic has differing classical juristic opinions (e.g. between Hanafi, Shafi'i, Maliki, Hanbali schools), acknowledge differences neutrally and respectfully without bias.
6. DO NOT issue definitive personal fatwas on high-stakes, complicated legal, or marital rulings. Include a respectful disclaimer: "Note: This is an educational reference, not a legal ruling (fatwa). For personal religious questions, consult a qualified Islamic scholar."
7. Language of response: Answer in the requested language: ${language === 'bn' ? 'Bengali (বাংলা)' : language === 'ar' ? 'Arabic (العربية)' : 'English'}. Include Arabic original terms with transliteration where helpful.`;

    const userPrompt = topicContext
      ? `Context topic: ${topicContext}\nUser question: ${question}`
      : question;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return res.json({
      answer: response.text || 'Unable to generate response. Please try again.',
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/ask:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while consulting the AI Islamic Assistant.',
    });
  }
});

// Serve PWA manifest and service worker explicitly for PWABuilder, browsers, and mobile devices
app.all(['/manifest.json', '/manifest.webmanifest'], (_req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});

app.all('/sw.js', (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

// Setup Vite middlewares for development or serve dist in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DEEN app running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
