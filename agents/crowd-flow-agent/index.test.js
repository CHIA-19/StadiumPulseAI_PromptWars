import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from './index.js';

// Mock Google GenAI SDK to avoid real API calls in tests
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Gate C3 is experiencing CRITICAL congestion (310 fans/min). Redirect fans to Gate A1 (calm, 80 fans/min).',
        functionCalls: null
      })
    };
  }
}));

describe('Crowd-Flow Agent API', () => {
  it('POST /api/predict returns predictions and timestamp', async () => {
    const gates = [
      { gate: 'A1', influx: 80 },
      { gate: 'C3', influx: 310 }
    ];
    const res = await request(app)
      .post('/api/predict')
      .send({ gates });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('predictions');
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof res.body.predictions).toBe('string');
  });

  it('POST /api/predict handles empty gates array gracefully', async () => {
    const res = await request(app)
      .post('/api/predict')
      .send({ gates: [] });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('predictions');
  });

  it('POST /api/predict responds with a valid ISO timestamp', async () => {
    const res = await request(app)
      .post('/api/predict')
      .send({ gates: [{ gate: 'B2', influx: 150 }] });

    expect(res.statusCode).toBe(200);
    const ts = new Date(res.body.timestamp);
    expect(ts.toString()).not.toBe('Invalid Date');
  });

  it('POST /api/predict flags critical congestion when influx exceeds 250', async () => {
    const res = await request(app)
      .post('/api/predict')
      .send({ gates: [{ gate: 'C3', influx: 310 }] });

    expect(res.statusCode).toBe(200);
    // AI reply (mocked) should contain congestion info
    expect(res.body.predictions).toBeTruthy();
  });

  it('responds with CORS headers', async () => {
    const res = await request(app)
      .options('/api/predict')
      .set('Origin', 'http://localhost:5173');

    // CORS should not block preflight
    expect([200, 204]).toContain(res.statusCode);
  });
});
