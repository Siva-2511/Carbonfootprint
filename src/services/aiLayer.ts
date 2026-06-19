import type { AIResponse } from '../types';
import { APP_CONFIG } from '../config';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/chat';

/**
 * Enhanced Local Proxy for Text Enhancement.
 */
export async function rawAIFetch(messages: { role: string; content: string }[], temperature = 0.7): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONFIG.aiTimeoutMs * 2);

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, temperature }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

/**
 * Enhanced Local Proxy for Text Enhancement.
 */
export async function enhanceText(
  localText: string
): Promise<AIResponse> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONFIG.aiTimeoutMs);

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Rewrite this sustainability advice in a friendly, encouraging tone in 2-3 sentences. Keep all specific numbers and facts. Do not add new claims:\n\n${localText}`
        }],
        max_tokens: 200,
        temperature: 0.4
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return { text: localText, source: 'local' };

    const data = await res.json();
    const enhanced = data?.choices?.[0]?.message?.content as string | undefined;

    return enhanced && enhanced.trim()
      ? { text: enhanced.trim(), source: 'gemini' }
      : { text: localText, source: 'local' };
  } catch {
    return { text: localText, source: 'local' };
  }
}

/**
 * OpenRouter Vision AI Proxy: Analyzes receipts or meal images.
 */
export async function analyzeImageWithAI(
  base64Image: string,
  prompt: string
): Promise<string | null> {
  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Need a vision-capable model
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: base64Image } }
          ]
        }],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!res.ok) {
      console.error('Vision API Error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content as string | undefined || null;
  } catch (err) {
    console.error('Vision network error:', err);
    return null;
  }
}

/**
 * Proxy for Conversational Chat.
 */
export async function chatWithAI(
  userMessage: string,
  systemContext: string
): Promise<AIResponse> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONFIG.aiTimeoutMs + 5000);

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: `${systemContext}\n\nUser Question: ${userMessage}` }
        ],
        max_tokens: 400,
        temperature: 0.6
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error('Backend Proxy Chat Error:', res.status, errText);
      return { text: '', source: 'local' };
    }

    const data = await res.json();
    const responseText = data?.choices?.[0]?.message?.content as string | undefined;

    return responseText && responseText.trim()
      ? { text: responseText.trim(), source: 'gemini' }
      : { text: '', source: 'local' };
  } catch (err) {
    console.error('Chat AI network error:', err);
    return { text: '', source: 'local' };
  }
}

/**
 * Proxy for Action Breakdown tutorial generation.
 */
export async function getActionBreakdown(
  actionName: string,
  userPersona: string
): Promise<string | null> {
  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `You are an AI Guide for CarbonSense. Create a 3-step tutorial on how to accomplish this sustainability action: "${actionName}".
          
          Persona context: ${userPersona}
          Format: 3 short, highly actionable bullet points. Keep it engaging. Use markdown.`
        }],
        max_tokens: 250,
        temperature: 0.5
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.choices?.[0]?.message?.content as string | undefined || null;
  } catch {
    return null;
  }
}
