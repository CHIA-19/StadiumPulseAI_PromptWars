import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './index.js';

// Mock the external SDKs so tests run without API keys
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Gate A1 is clear with 34% density. Wait time is under 1 minute. Recommended for entry.',
        functionCalls: null
      })
    };
  }
}));

vi.mock('@google-cloud/translate/build/src/v2/index.js', () => ({
  Translate: class {
    translate = vi.fn().mockResolvedValue(['Translated message']);
  }
}));

describe('Concierge Agent API', () => {
  it('POST /api/chat returns a reply for an English message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello, which gate is least busy?', userLanguage: 'EN' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
    expect(typeof res.body.reply).toBe('string');
  });

  it('POST /api/chat defaults userLanguage to EN when not provided', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Where is the nearest restroom?' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
  });

  it('POST /api/chat handles non-English language (triggers translation flow)', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '¿Cuál es la salida más cercana?', userLanguage: 'ES' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
    // Since translate is mocked, reply should still be a string
    expect(typeof res.body.reply).toBe('string');
  });

  it('POST /api/chat handles gate status query correctly', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What is the status of Gate A1?', userLanguage: 'EN' });

    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toBeTruthy();
  });

  it('POST /api/chat handles transit query correctly', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What are the best transit options from the stadium?', userLanguage: 'EN' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
  });

  it('GET /api/chat returns 404 for wrong HTTP method', async () => {
    const res = await request(app).get('/api/chat');
    expect(res.statusCode).toBe(404);
  });
});
