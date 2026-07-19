import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './index.js';

// Mock Google GenAI SDK to avoid real API calls in tests
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: '1. Metro Line 3 (eco, 0.4kg CO₂) – departs 21:47. 2. Bus 47X (1.2kg CO₂) – departs 21:52. Recommendation: Take Metro Line 3 for low-carbon transit.',
        functionCalls: null
      })
    };
  }
}));

describe('Mobility Agent API', () => {
  it('POST /api/routes returns itineraries and timestamp', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({ destination: 'Manhattan, NY', preferEco: true });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('itineraries');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('POST /api/routes returns a string for itineraries', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({ destination: 'Newark Airport', preferEco: false });

    expect(typeof res.body.itineraries).toBe('string');
  });

  it('POST /api/routes produces a valid ISO timestamp', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({ destination: 'Times Square', preferEco: true });

    const ts = new Date(res.body.timestamp);
    expect(ts.toString()).not.toBe('Invalid Date');
  });

  it('POST /api/routes works when preferEco is false (car/rideshare)', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({ destination: 'JFK Airport', preferEco: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.itineraries).toBeTruthy();
  });

  it('POST /api/routes handles missing destination gracefully', async () => {
    const res = await request(app)
      .post('/api/routes')
      .send({ preferEco: true });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('itineraries');
  });

  it('GET /api/routes returns 404 for wrong method', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.statusCode).toBe(404);
  });
});
