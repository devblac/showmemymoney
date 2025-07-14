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

export class InMemoryStorage implements IStorage {
  private cashAccount: CashAccount = { balance: 100000 }; // Initial balance
  private securities: Security[] = [];
  private positions: Position[] = [];
  private quotes: Quote[] = [];
  private historicalQuotes: Quote[] = [];
  private settings: Settings = {
    marketData: {
      source: 'hardcoded',
    },
  };

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Sample securities
    this.securities = [
      { id: '1', symbol: 'AAPL', name: 'Apple Inc.', type: 'acción' },
      { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'acción' },
      { id: '3', symbol: 'BOND1', name: 'Government Bond', type: 'bono' },
      { id: '4', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'acción' },
    ];

    const now = new Date();
    // Sample quotes
    this.quotes = [
      { securityId: '1', price: 150.0, at: now },
      { securityId: '2', price: 2800.0, at: now },
      { securityId: '3', price: 1000.0, at: now },
      { securityId: '4', price: 380.0, at: now },
    ];

    // Initialize historical quotes with current quotes
    this.historicalQuotes = [...this.quotes];

    // Sample positions
    this.positions = [
      { securityId: '1', quantity: 10 },
      { securityId: '2', quantity: 5 },
    ];
  }

  async getCashAccount(): Promise<CashAccount> {
    return { ...this.cashAccount };
  }

  async updateCashAccount(account: CashAccount): Promise<void> {
    this.cashAccount = { ...account };
  }

  async getSecurities(): Promise<Security[]> {
    return [...this.securities];
  }

  async getSecurityById(id: string): Promise<Security | null> {
    return this.securities.find(s => s.id === id) || null;
  }

  async createSecurity(security: Security): Promise<void> {
    this.securities.push({ ...security });
  }

  async getPositions(): Promise<Position[]> {
    return [...this.positions];
  }

  async getPositionBySecurityId(securityId: string): Promise<Position | null> {
    return this.positions.find(p => p.securityId === securityId) || null;
  }

  async updatePosition(position: Position): Promise<void> {
    const index = this.positions.findIndex(p => p.securityId === position.securityId);
    if (index >= 0) {
      this.positions[index] = { ...position };
    } else {
      this.positions.push({ ...position });
    }
  }

  async deletePosition(securityId: string): Promise<void> {
    this.positions = this.positions.filter(p => p.securityId !== securityId);
  }

  async getQuotes(): Promise<Quote[]> {
    return [...this.quotes];
  }

  async getQuoteBySecurityId(securityId: string): Promise<Quote | null> {
    return this.quotes.find(q => q.securityId === securityId) || null;
  }

  async updateQuote(quote: Quote): Promise<void> {
    const index = this.quotes.findIndex(q => q.securityId === quote.securityId);
    if (index >= 0) {
      this.quotes[index] = { ...quote };
    } else {
      this.quotes.push({ ...quote });
    }

    // Store in historical quotes
    this.historicalQuotes.push({ ...quote });
  }

  async getQuoteBySecurityIdAndDate(securityId: string, at: Date): Promise<Quote | null> {
    // Find the most recent quote before or at the given date
    const validQuotes = this.historicalQuotes
      .filter(q => q.securityId === securityId && q.at <= at)
      .sort((a, b) => b.at.getTime() - a.at.getTime());

    return validQuotes[0] || null;
  }

  async getPortfolioValue(): Promise<PortfolioDTO> {
    const cash = await this.getCashAccount();
    const positions = await this.getPositions();
    const securities = await this.getSecurities();

    const positionDetails = await Promise.all(
      positions.map(async position => {
        const security = securities.find(s => s.id === position.securityId);
        const quote = await this.getQuoteBySecurityId(position.securityId);

        if (!security || !quote) {
          throw new Error(
            `Instrumento o cotización no encontrada para la posición ${position.securityId}`
          );
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

  async transactBuy(securityId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser positiva');
    }

    const security = await this.getSecurityById(securityId);
    if (!security) {
      throw new Error('Instrumento no encontrado');
    }

    const quote = await this.getQuoteBySecurityId(securityId);
    if (!quote) {
      throw new Error('Cotización no encontrada');
    }

    const cost = quantity * quote.price;
    const cash = await this.getCashAccount();

    if (cash.balance < cost) {
      throw new Error('Fondos insuficientes');
    }

    // Update cash
    await this.updateCashAccount({ balance: cash.balance - cost });

    // Update position
    const existingPosition = await this.getPositionBySecurityId(securityId);
    if (existingPosition) {
      await this.updatePosition({
        securityId,
        quantity: existingPosition.quantity + quantity,
      });
    } else {
      await this.updatePosition({ securityId, quantity });
    }
  }

  async transactSell(securityId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser positiva');
    }

    const security = await this.getSecurityById(securityId);
    if (!security) {
      throw new Error('Instrumento no encontrado');
    }

    const quote = await this.getQuoteBySecurityId(securityId);
    if (!quote) {
      throw new Error('Cotización no encontrada');
    }

    const position = await this.getPositionBySecurityId(securityId);
    if (!position || position.quantity < quantity) {
      throw new Error('Títulos insuficientes');
    }

    const proceeds = quantity * quote.price;
    const cash = await this.getCashAccount();

    // Update cash
    await this.updateCashAccount({ balance: cash.balance + proceeds });

    // Update position
    const newQuantity = position.quantity - quantity;
    if (newQuantity === 0) {
      await this.deletePosition(securityId);
    } else {
      await this.updatePosition({ securityId, quantity: newQuantity });
    }
  }

  async getValuationAtDate(at: Date): Promise<ValuationResponse> {
    const positions = await this.getPositions();
    const cash = await this.getCashAccount();

    // Calculate historical valuation
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

  async getSettings(): Promise<Settings> {
    return { ...this.settings };
  }

  async updateSettings(settings: Settings): Promise<void> {
    this.settings = { ...settings };
  }

  async updateMarketDataConfig(config: MarketDataConfig): Promise<void> {
    this.settings.marketData = { ...config };
  }
}
