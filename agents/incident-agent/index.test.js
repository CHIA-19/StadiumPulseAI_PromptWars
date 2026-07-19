import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './index.js';

// Mock Google GenAI SDK to avoid real API calls in tests
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: 'SEVERITY: HIGH. Incident classified as crowd surge. Assigned to: Security Lead. Immediate evacuation protocol recommended.',
        functionCalls: null
      })
    };
  }
}));

describe('Incident Triage Agent API', () => {
  it('POST /api/triage returns triageDetails and timestamp', async () => {
    const res = await request(app)
      .post('/api/triage')
      .send({ imageUri: 'https://example.com/photo.jpg', details: 'Fan fell near Gate C3 entrance' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('triageDetails');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('POST /api/triage returns a string for triageDetails', async () => {
    const res = await request(app)
      .post('/api/triage')
      .send({ imageUri: 'https://example.com/incident.jpg', details: 'Medical emergency in Section 108' });

    expect(typeof res.body.triageDetails).toBe('string');
  });

  it('POST /api/triage produces a valid ISO timestamp', async () => {
    const res = await request(app)
      .post('/api/triage')
      .send({ imageUri: '', details: 'Spilled liquid on Concourse B' });

    expect(res.statusCode).toBe(200);
    const ts = new Date(res.body.timestamp);
    expect(ts.toString()).not.toBe('Invalid Date');
  });

  it('POST /api/triage handles missing imageUri gracefully', async () => {
    const res = await request(app)
      .post('/api/triage')
      .send({ details: 'Lost child near info desk' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('triageDetails');
  });

  it('POST /api/triage handles missing details gracefully', async () => {
    const res = await request(app)
      .post('/api/triage')
      .send({ imageUri: 'https://example.com/photo.jpg' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('triageDetails');
  });

  it('GET /api/triage returns 404 for wrong method', async () => {
    const res = await request(app).get('/api/triage');
    expect(res.statusCode).toBe(404);
  });
});
