/**
 * @fileoverview AI service layer that proxies all AI/LLM requests through the backend API.
 * Provides functions for text enhancement, image analysis, conversational chat,
 * action breakdowns, and product carbon footprint estimation.
 */

import type { AIResponse } from '../types';
import { APP_CONFIG } from '../config';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? '/api/chat';

/**
 * Raw proxy call for generic AI tasks.
 * Sends an arbitrary message array to the backend and returns the model's text response.
 * @param messages - Array of chat messages with role and content fields.
 * @param temperature - Sampling temperature for the model (default: 0.7).
 * @returns The AI-generated text string, or null on failure.
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
 * Rewrites sustainability advice text in a friendly, encouraging tone while preserving facts.
 * Falls back to the original local text if the AI request fails.
 * @param localText - The original sustainability advice text to enhance.
 * @returns An AIResponse with the enhanced (or original) text and its source.
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
 * Sends a base64-encoded image along with a prompt to a vision-capable model.
 * @param base64Image - The base64-encoded image data URL to analyze.
 * @param prompt - The text instruction describing what to extract from the image.
 * @returns The AI-generated analysis string, or null on failure.
 */
export async function analyzeImageWithAI(
  base64Image: string,
  prompt: string
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONFIG.aiTimeoutMs * 2);

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
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

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
 * Sends a user message with system context to the AI and returns the response.
 * Falls back to an empty local response on error.
 * @param userMessage - The user's chat message text.
 * @param systemContext - System-level context string to prepend to the conversation.
 * @returns An AIResponse with the assistant's reply text and its source.
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
 * Generates a 3-step, persona-aware tutorial for a sustainability action.
 * @param actionName - The name of the sustainability action to create a tutorial for.
 * @param userPersona - A description of the user's persona for personalized guidance.
 * @returns A markdown-formatted 3-step tutorial string, or null on failure.
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

/**
 * AI Proxy to estimate the carbon footprint of a custom product.
 * Queries the AI model for cradle-to-gate CO₂e in kg and parses the JSON response.
 * @param productName - The name of the product to estimate the carbon footprint for.
 * @returns The estimated carbon footprint in kg CO₂e as a number, or null on failure.
 * @example
 * const kg = await estimateProductFootprint('cotton t-shirt');
 * // Returns e.g. 8.1 (kg CO₂e)
 */
export async function estimateProductFootprint(productName: string): Promise<number | null> {
  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Estimate the cradle-to-gate carbon footprint of this product: "${productName}". Return ONLY a JSON object in this format: { "co2": 45.5 }. Do not include any other text or markdown formatting. The co2 value should be a number representing kg CO2e.`
        }],
        max_tokens: 100,
        temperature: 0.2
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content as string | undefined || '';
    
    // Attempt to parse JSON from the response
    const match = text.match(/{\s*"co2"\s*:\s*([\d.]+)\s*}/);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
    
    // Fallback: Just try parsing the whole response as JSON
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed.co2 === 'number') {
        return parsed.co2;
      }
    } catch {
      // Ignore parse error
    }

    return null;
  } catch {
    return null;
  }
}
