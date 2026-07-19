import { describe, it, expect } from 'vitest';
import { GATES, TRANSITS, INCIDENTS, MATCHES, LEADERBOARD, AI_REPLIES } from '../data/mockData';

describe('mockData', () => {
  describe('GATES', () => {
    it('exports an array of gates', () => {
      expect(Array.isArray(GATES)).toBe(true);
      expect(GATES.length).toBe(6);
    });

    it('every gate has required fields', () => {
      GATES.forEach(gate => {
        expect(gate).toHaveProperty('id');
        expect(gate).toHaveProperty('name');
        expect(gate).toHaveProperty('density');
        expect(gate).toHaveProperty('status');
        expect(gate).toHaveProperty('wait');
        expect(gate).toHaveProperty('crowd');
      });
    });

    it('density values are between 0 and 100', () => {
      GATES.forEach(gate => {
        expect(gate.density).toBeGreaterThanOrEqual(0);
        expect(gate.density).toBeLessThanOrEqual(100);
      });
    });

    it('status values are valid', () => {
      const validStatuses = ['calm', 'caution', 'critical'];
      GATES.forEach(gate => {
        expect(validStatuses).toContain(gate.status);
      });
    });

    it('includes a critical gate (C3)', () => {
      const criticalGate = GATES.find(g => g.status === 'critical');
      expect(criticalGate).toBeDefined();
      expect(criticalGate.id).toBe('C3');
    });

    it('identifies calm gates correctly', () => {
      const calmGates = GATES.filter(g => g.status === 'calm');
      expect(calmGates.length).toBeGreaterThan(0);
      calmGates.forEach(g => expect(g.density).toBeLessThan(50));
    });
  });

  describe('TRANSITS', () => {
    it('exports an array of transit options', () => {
      expect(Array.isArray(TRANSITS)).toBe(true);
      expect(TRANSITS.length).toBe(4);
    });

    it('every transit has required fields', () => {
      TRANSITS.forEach(t => {
        expect(t).toHaveProperty('type');
        expect(t).toHaveProperty('icon');
        expect(t).toHaveProperty('name');
        expect(t).toHaveProperty('sub');
        expect(t).toHaveProperty('time');
        expect(t).toHaveProperty('co2');
        expect(t).toHaveProperty('rec');
      });
    });

    it('exactly one transit is the AI recommendation', () => {
      const recommended = TRANSITS.filter(t => t.rec === true);
      expect(recommended.length).toBe(1);
    });

    it('Metro Line 3 is the recommended option', () => {
      const metro = TRANSITS.find(t => t.name === 'Metro Line 3');
      expect(metro).toBeDefined();
      expect(metro.rec).toBe(true);
    });

    it('walking has zero CO₂ emissions', () => {
      const walk = TRANSITS.find(t => t.type === 'walk');
      expect(walk).toBeDefined();
      expect(walk.co2).toBe('0 kg');
    });
  });

  describe('INCIDENTS', () => {
    it('exports an array of incidents', () => {
      expect(Array.isArray(INCIDENTS)).toBe(true);
      expect(INCIDENTS.length).toBe(5);
    });

    it('every incident has required fields', () => {
      INCIDENTS.forEach(inc => {
        expect(inc).toHaveProperty('id');
        expect(inc).toHaveProperty('title');
        expect(inc).toHaveProperty('loc');
        expect(inc).toHaveProperty('time');
        expect(inc).toHaveProperty('sev');
        expect(inc).toHaveProperty('assigned');
      });
    });

    it('severity values are valid', () => {
      const validSeverities = ['high', 'med', 'low'];
      INCIDENTS.forEach(inc => {
        expect(validSeverities).toContain(inc.sev);
      });
    });

    it('includes incidents of each severity level', () => {
      const sevLevels = INCIDENTS.map(i => i.sev);
      expect(sevLevels).toContain('high');
      expect(sevLevels).toContain('med');
      expect(sevLevels).toContain('low');
    });

    it('incident IDs are unique', () => {
      const ids = INCIDENTS.map(i => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(INCIDENTS.length);
    });
  });

  describe('MATCHES', () => {
    it('exports an array of matches', () => {
      expect(Array.isArray(MATCHES)).toBe(true);
      expect(MATCHES.length).toBeGreaterThan(0);
    });

    it('includes a live match', () => {
      const liveMatch = MATCHES.find(m => m.status === 'live');
      expect(liveMatch).toBeDefined();
    });

    it('every match has required fields', () => {
      MATCHES.forEach(match => {
        expect(match).toHaveProperty('t1');
        expect(match).toHaveProperty('t2');
        expect(match).toHaveProperty('venue');
        expect(match).toHaveProperty('status');
      });
    });
  });

  describe('LEADERBOARD', () => {
    it('exports an array of leaderboard entries', () => {
      expect(Array.isArray(LEADERBOARD)).toBe(true);
      expect(LEADERBOARD.length).toBe(5);
    });

    it('every entry has name, flag, co2, and pct', () => {
      LEADERBOARD.forEach(entry => {
        expect(entry).toHaveProperty('name');
        expect(entry).toHaveProperty('flag');
        expect(entry).toHaveProperty('co2');
        expect(entry).toHaveProperty('pct');
      });
    });

    it('pct values are between 0 and 100', () => {
      LEADERBOARD.forEach(entry => {
        expect(entry.pct).toBeGreaterThanOrEqual(0);
        expect(entry.pct).toBeLessThanOrEqual(100);
      });
    });

    it('first entry has highest pct (sorted descending)', () => {
      expect(LEADERBOARD[0].pct).toBeGreaterThan(LEADERBOARD[LEADERBOARD.length - 1].pct);
    });
  });

  describe('AI_REPLIES', () => {
    it('exports an array of AI replies', () => {
      expect(Array.isArray(AI_REPLIES)).toBe(true);
      expect(AI_REPLIES.length).toBeGreaterThan(0);
    });

    it('all replies are non-empty strings', () => {
      AI_REPLIES.forEach(reply => {
        expect(typeof reply).toBe('string');
        expect(reply.length).toBeGreaterThan(0);
      });
    });
  });
});
