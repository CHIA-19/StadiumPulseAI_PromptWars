import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './index.js';

// Mock Google GenAI SDK to avoid real API calls in tests
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: `StadiumPulse AI – Post-Match Sustainability Report\n\n• CO₂ Saved: 142 tonnes (vs baseline)\n• Waste Diversion Rate: 89% — excellent performance\n• Energy Efficiency: 42% powered by onsite solar\n• 82% of fans used low-carbon transport options\n\nOverall sustainability rating: EXCELLENT ⭐`,
        functionCalls: null
      })
    };
  }
}));

describe('Sustainability Agent API', () => {
  it('POST /api/report returns report and timestamp', async () => {
    const res = await request(app)
      .post('/api/report')
      .send({
        metrics: {
          co2Saved: '142t',
          wasteDiversion: '89%',
          energyEfficiency: '42% solar'
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('report');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('POST /api/report returns a string for report', async () => {
    const res = await request(app)
      .post('/api/report')
      .send({ metrics: { co2Saved: '100t', wasteDiversion: '75%', energyEfficiency: '30%' } });

    expect(typeof res.body.report).toBe('string');
  });

  it('POST /api/report produces a valid ISO timestamp', async () => {
    const res = await request(app)
      .post('/api/report')
      .send({ metrics: { co2Saved: '0t', wasteDiversion: '50%', energyEfficiency: '0%' } });

    expect(res.statusCode).toBe(200);
    const ts = new Date(res.body.timestamp);
    expect(ts.toString()).not.toBe('Invalid Date');
  });

  it('POST /api/report handles empty metrics gracefully', async () => {
    const res = await request(app)
      .post('/api/report')
      .send({ metrics: {} });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('report');
  });

  it('POST /api/report handles missing metrics field gracefully', async () => {
    const res = await request(app)
      .post('/api/report')
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('report');
  });

  it('GET /api/report returns 404 for wrong method', async () => {
    const res = await request(app).get('/api/report');
    expect(res.statusCode).toBe(404);
  });
});
