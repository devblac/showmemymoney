import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryStorage } from './InMemoryStorage.js';

describe('InMemoryStorage', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
  });

  describe('Cash operations', () => {
    it('should initialize with default balancew', async () => {
      const cash = await storage.getCashAccount();
      expect(cash.balance).toBe(100000);
    });

    it('should update cashh balance', async () => {
      await storage.updateCashAccount({ balance: 50000 });
      const cash = await storage.getCashAccount();
      expect(cash.balance).toBe(50000);
    });
  });

  describe('Security operations', () => {
    it('should return initial securities', async () => {
      const securities = await storage.getSecurities();
      expect(securities.length).toBeGreaterThan(0);
    });

    it('should find security by id', async () => {
      const security = await storage.getSecurityById('1');
      expect(security).toBeTruthy();
      expect(security?.symbol).toBe('AAPL');
    });

    it('should return null for non-existent security', async () => {
      const security = await storage.getSecurityById('999');
      expect(security).toBeNull();
    });
  });

  describe('Transaction operations', () => {
    it('should buy securities successfully', async () => {
      const initialCash = await storage.getCashAccount();
      await storage.transactBuy('1', 5);
      
      const finalCash = await storage.getCashAccount();
      expect(finalCash.balance).toBeLessThan(initialCash.balance);
      
      const position = await storage.getPositionBySecurityId('1');
      expect(position?.quantity).toBe(15); // 10 initial + 5 bought
    });

    it('should reject buy with insufficient funds', async () => {
      await storage.updateCashAccount({ balance: 100 });
      
      await expect(storage.transactBuy('1', 100)).rejects.toThrow('Insufficient cash balance');
    });

    it('should sell securities successfully', async () => {
      const initialCash = await storage.getCashAccount();
      await storage.transactSell('1', 5);
      
      const finalCash = await storage.getCashAccount();
      expect(finalCash.balance).toBeGreaterThan(initialCash.balance);
      
      const position = await storage.getPositionBySecurityId('1');
      expect(position?.quantity).toBe(5); // 10 initial - 5 sold
    });

    it('should reject sell with insufficient holdings', async () => {
      await expect(storage.transactSell('1', 100)).rejects.toThrow('Insufficient holdings');
    });

    it('should reject buy/sell with invalid quantity', async () => {
      await expect(storage.transactBuy('1', 0)).rejects.toThrow('Quantity must be positive');
      await expect(storage.transactSell('1', -1)).rejects.toThrow('Quantity must be positive');
    });
  });

  describe('Portfolio valuation', () => {
    it('should calculate correct portfolio value', async () => {
      const portfolio = await storage.getPortfolioValue();
      
      expect(portfolio.cash.balance).toBe(100000);
      expect(portfolio.positions.length).toBeGreaterThan(0);
      expect(portfolio.totalValuation).toBeGreaterThan(portfolio.cash.balance);
    });
  });
});