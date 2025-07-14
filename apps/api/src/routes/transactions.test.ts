import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createServer } from '../server.js';
import { Express } from 'express';

describe('Transactions API', () => {
  let app: Express;

  beforeEach(() => {
    app = createServer();
  });

  describe('POST /api/transactions/buy', () => {
    it('should buy securities successfully', async () => {
      const response = await request(app)
        .post('/api/transactions/buy')
        .send({ securityId: '1', quantity: 1 })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject invalid request', async () => {
      await request(app)
        .post('/api/transactions/buy')
        .send({ securityId: '1', quantity: -1 })
        .expect(400);
    });
  });

  describe('POST /api/transactions/sell', () => {
    it('should sell securities successfully', async () => {
      const response = await request(app)
        .post('/api/transactions/sell')
        .send({ securityId: '1', quantity: 1 })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject selling more than owned', async () => {
      await request(app)
        .post('/api/transactions/sell')
        .send({ securityId: '1', quantity: 1000 })
        .expect(422);
    });
  });
});
