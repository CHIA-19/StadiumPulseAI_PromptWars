import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './index.js';

// Mock the external SDKs so tests run without API keys
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({ text: 'Mock response' })
    };
  }
}));

vi.mock('@google-cloud/translate/build/src/v2/index.js', () => ({
  Translate: class {
    translate = vi.fn().mockResolvedValue(['Translated message']);
  }
}));

describe('Concierge Agent API', () => {
  it('should start and expose /api/chat endpoint', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reply');
  });
});
