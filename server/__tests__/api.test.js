import request from 'supertest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import app from '../index.js';

describe('API Proxy Endpoints', () => {
  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = 'test_key';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/health returns 200 OK without csp flag', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /api/chat returns 400 Bad Request on malformed payload', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ someOtherKey: 'no messages array' });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid message payload structure.');
  });

  it('POST /api/chat handles mock OpenRouter response and serves from cache', async () => {
    // Mock the global fetch
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Mock response' } }] })
    });

    const payload = {
      messages: [{ role: 'user', content: 'hello' }]
    };

    // First request
    const res1 = await request(app).post('/api/chat').send(payload);
    expect(res1.status).toBe(200);
    expect(res1.body.choices[0].message.content).toBe('Mock response');
    
    // Check if fetch was called
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second identical request
    const res2 = await request(app).post('/api/chat').send(payload);
    expect(res2.status).toBe(200);
    expect(res2.body.choices[0].message.content).toBe('Mock response');

    // Fetch should NOT be called again due to caching
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
