import {
  CashAccount,
  Security,
  Position,
  Quote,
  PortfolioDTO,
  ValuationResponse,
  Settings,
  MarketDataConfig,
} from '../models/types.js';
import { IStorage } from './IStorage.js';

export class LocalStorage implements IStorage {
  private readonly STORAGE_KEYS = {
    CASH: 'smm_cash',
    SECURITIES: 'smm_securities',
    POSITIONS: 'smm_positions',
    QUOTES: 'smm_quotes',
    HISTORICAL_QUOTES: 'smm_historical_quotes',
    SETTINGS: 'smm_settings',
  };

  constructor() {
    this.initializeIfEmpty();
  }

  private initializeIfEmpty(): void {
    if (!window.localStorage.getItem(this.STORAGE_KEYS.CASH)) {
      window.localStorage.setItem(this.STORAGE_KEYS.CASH, JSON.stringify({ balance: 100000 }));
    }

    if (!window.localStorage.getItem(this.STORAGE_KEYS.SECURITIES)) {
      const defaultSecurities = [
        { id: '1', symbol: 'AAPL', name: 'Apple Inc.', type: 'acción' },
        { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'acción' },
        { id: '3', symbol: 'BOND1', name: 'Government Bond', type: 'bono' },
        { id: '4', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'acción' },
      ];
      window.localStorage.setItem(this.STORAGE_KEYS.SECURITIES, JSON.stringify(defaultSecurities));
    }

    if (!window.localStorage.getItem(this.STORAGE_KEYS.POSITIONS)) {
      const defaultPositions = [
        { securityId: '1', quantity: 10 },
        { securityId: '2', quantity: 5 },
      ];
      window.localStorage.setItem(this.STORAGE_KEYS.POSITIONS, JSON.stringify(defaultPositions));
    }

    if (!window.localStorage.getItem(this.STORAGE_KEYS.QUOTES)) {
      const now = new Date();
      const defaultQuotes = [
        { securityId: '1', price: 150.0, at: now },
        { securityId: '2', price: 2800.0, at: now },
        { securityId: '3', price: 1000.0, at: now },
        { securityId: '4', price: 380.0, at: now },
      ];
      window.localStorage.setItem(this.STORAGE_KEYS.QUOTES, JSON.stringify(defaultQuotes));
      window.localStorage.setItem(
        this.STORAGE_KEYS.HISTORICAL_QUOTES,
        JSON.stringify(defaultQuotes)
      );
    }

    if (!window.localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
        marketData: {
          source: 'hardcoded',
        },
      };
      window.localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
  }

  async getCashAccount(): Promise<CashAccount> {
    return JSON.parse(window.localStorage.getItem(this.STORAGE_KEYS.CASH) || '{"balance": 0}');
  }

  async updateCashAccount(account: CashAccount): Promise<void> {
    window.localStorage.setItem(this.STORAGE_KEYS.CASH, JSON.stringify(account));
  }

  async getSecurities(): Promise<Security[]> {
    return JSON.parse(window.localStorage.getItem(this.STORAGE_KEYS.SECURITIES) || '[]');
  }

  async getSecurityById(id: string): Promise<Security | null> {
    const securities = await this.getSecurities();
    return securities.find(s => s.id === id) || null;
  }

  async createSecurity(security: Security): Promise<void> {
    const securities = await this.getSecurities();
    securities.push(security);
    window.localStorage.setItem(this.STORAGE_KEYS.SECURITIES, JSON.stringify(securities));
  }

  async getPositions(): Promise<Position[]> {
    return JSON.parse(window.localStorage.getItem(this.STORAGE_KEYS.POSITIONS) || '[]');
  }

  async getPositionBySecurityId(securityId: string): Promise<Position | null> {
    const positions = await this.getPositions();
    return positions.find(p => p.securityId === securityId) || null;
  }

  async updatePosition(position: Position): Promise<void> {
    const positions = await this.getPositions();
    const index = positions.findIndex(p => p.securityId === position.securityId);
    if (index >= 0) {
      positions[index] = position;
    } else {
      positions.push(position);
    }
    window.localStorage.setItem(this.STORAGE_KEYS.POSITIONS, JSON.stringify(positions));
  }

  async deletePosition(securityId: string): Promise<void> {
    const positions = await this.getPositions();
    const filtered = positions.filter(p => p.securityId !== securityId);
    window.localStorage.setItem(this.STORAGE_KEYS.POSITIONS, JSON.stringify(filtered));
  }

  async getQuotes(): Promise<Quote[]> {
    return JSON.parse(window.localStorage.getItem(this.STORAGE_KEYS.QUOTES) || '[]');
  }

  async getQuoteBySecurityId(securityId: string): Promise<Quote | null> {
    const quotes = await this.getQuotes();
    return quotes.find(q => q.securityId === securityId) || null;
  }

  async updateQuote(quote: Quote): Promise<void> {
    const quotes = await this.getQuotes();
    const index = quotes.findIndex(q => q.securityId === quote.securityId);
    if (index >= 0) {
      quotes[index] = quote;
    } else {
      quotes.push(quote);
    }
    window.localStorage.setItem(this.STORAGE_KEYS.QUOTES, JSON.stringify(quotes));

    // Update historical quotes
    const historicalQuotes = JSON.parse(
      window.localStorage.getItem(this.STORAGE_KEYS.HISTORICAL_QUOTES) || '[]'
    );
    historicalQuotes.push(quote);
    window.localStorage.setItem(
      this.STORAGE_KEYS.HISTORICAL_QUOTES,
      JSON.stringify(historicalQuotes)
    );
  }

  async getQuoteBySecurityIdAndDate(securityId: string, at: Date): Promise<Quote | null> {
    const historicalQuotes = JSON.parse(
      window.localStorage.getItem(this.STORAGE_KEYS.HISTORICAL_QUOTES) || '[]'
    );
    const validQuotes = historicalQuotes
      .filter(q => q.securityId === securityId && new Date(q.at) <= at)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    return validQuotes[0] || null;
  }

  async getSettings(): Promise<Settings> {
    return JSON.parse(
      window.localStorage.getItem(this.STORAGE_KEYS.SETTINGS) ||
        '{"marketData":{"source":"hardcoded"}}'
    );
  }

  async updateSettings(settings: Settings): Promise<void> {
    window.localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  async updateMarketDataConfig(config: MarketDataConfig): Promise<void> {
    const settings = await this.getSettings();
    settings.marketData = config;
    window.localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  async getPortfolioValue(): Promise<PortfolioDTO> {
    const [cash, positions, securities] = await Promise.all([
      this.getCashAccount(),
      this.getPositions(),
      this.getSecurities(),
    ]);

    const positionDetails = await Promise.all(
      positions.map(async position => {
        const security = securities.find(s => s.id === position.securityId);
        const quote = await this.getQuoteBySecurityId(position.securityId);

        if (!security || !quote) {
          throw new Error(`Security or quote not found for position ${position.securityId}`);
        }

        return {
          security,
          quantity: position.quantity,
          unitPrice: quote.price,
          valuation: position.quantity * quote.price,
        };
      })
    );

    const totalValuation =
      cash.balance + positionDetails.reduce((sum, pos) => sum + pos.valuation, 0);

    return {
      cash,
      positions: positionDetails,
      securities,
      totalValuation,
    };
  }

  async getValuationAtDate(at: Date): Promise<ValuationResponse> {
    const [positions, cash] = await Promise.all([this.getPositions(), this.getCashAccount()]);

    const positionsValue = await Promise.all(
      positions.map(async position => {
        const quote = await this.getQuoteBySecurityIdAndDate(position.securityId, at);
        if (!quote) return 0;
        return position.quantity * quote.price;
      })
    );

    const totalValuation = cash.balance + positionsValue.reduce((sum, val) => sum + val, 0);

    return {
      totalValuation,
      at,
    };
  }

  // Método para mostrar el estado actual en la consola
  async dumpState(): Promise<void> {
    const state = {
      cash: await this.getCashAccount(),
      securities: await this.getSecurities(),
      positions: await this.getPositions(),
      quotes: await this.getQuotes(),
      settings: await this.getSettings(),
      portfolio: await this.getPortfolioValue(),
    };

    console.group('📦 Local Storage Database State');
    Object.entries(state).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
    console.groupEnd();
  }
}
