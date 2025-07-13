import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createServer } from '../server.js';
import { Express } from 'express';

describe('Portfolio API', () => {
  let app: Express;

  beforeEach(() => {
    app = createServer();
  });

  describe('GET /api/portfolio', () => {
    it('should return portfolio data', async () => {
      const response = await request(app)
        .get('/api/portfolio')
        .expect(200);

      expect(response.body).toHaveProperty('cash');
      expect(response.body).toHaveProperty('positions');
      expect(response.body).toHaveProperty('securities');
      expect(response.body).toHaveProperty('totalValuation');
      expect(response.body.cash).toHaveProperty('balance');
    });
  });
});