import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Strict Security Headers via Helmet
// Helmet automatically sets strict Content-Security-Policy, HSTS, NoSniff, X-Frame-Options, etc.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://openrouter.ai"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://ajax.googleapis.com", "https://translate.google.com", "https://translate.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://translate.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://www.gstatic.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// 2. Strict CORS Policy
const allowedOrigins = process.env.VITE_ALLOWED_ORIGINS 
  ? process.env.VITE_ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Body Parsing
app.use(express.json({ limit: '10mb' })); // Limit payload size to prevent payload bombing

// 4. Rate Limiting (DDoS Protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// 4.1 Bounded LRU Cache for identical requests
const responseCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_ENTRIES = 200;

// 4.2 Health Check Route (Exempt from rate limiting AI specifically if needed, but handled globally here)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 5. Secure Proxy Route for AI Integration
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;
    
    // Strict Input Validation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message payload structure.' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('SERVER ERROR: OPENROUTER_API_KEY missing from .env');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const payload = JSON.stringify({
      model: model || 'google/gemma-4-31b-it:free',
      messages,
      temperature: temperature || 0.6,
      max_tokens: max_tokens || 1000
    });

    // Check Cache
    // Create a simple hash/key from the payload string
    let cacheKey = 0;
    for (let i = 0; i < payload.length; i++) {
      cacheKey = Math.imul(31, cacheKey) + payload.charCodeAt(i) | 0;
    }
    const keyStr = cacheKey.toString();

    if (responseCache.has(keyStr)) {
      const cached = responseCache.get(keyStr);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
      } else {
        responseCache.delete(keyStr); // expired
      }
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CarbonSense Secure',
        'Content-Type': 'application/json'
      },
      body: payload
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Upstream API Error:', response.status, errText);
      return res.status(response.status).json({ error: 'AI provider error', details: errText });
    }

    const data = await response.json();
    responseCache.set(keyStr, { timestamp: Date.now(), data });
    
    // Evict oldest if cache exceeds MAX_CACHE_ENTRIES
    if (responseCache.size > MAX_CACHE_ENTRIES) {
      const oldestKey = responseCache.keys().next().value;
      responseCache.delete(oldestKey);
    }
    
    res.json(data);
  } catch (error) {
    console.error('Backend Proxy Error:', error);
    res.status(500).json({ error: 'Internal server error while communicating with AI.' });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🔒 Secure Backend API listening on port ${PORT}`);
    console.log(`Security measures active: Helmet HSTS/CSP, Rate Limiting, Strict CORS.`);
  });
}

export default app;
