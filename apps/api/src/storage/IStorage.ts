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

export enum StorageType {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  POSTGRESQL = 'postgresql',
}

export interface StorageConfig {
  type: StorageType;
  postgresql?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
}

export interface IStorage {
  // CRUD for entities
  getCashAccount(): Promise<CashAccount>;
  updateCashAccount(account: CashAccount): Promise<void>;

  getSecurities(): Promise<Security[]>;
  getSecurityById(id: string): Promise<Security | null>;
  createSecurity(security: Security): Promise<void>;

  getPositions(): Promise<Position[]>;
  getPositionBySecurityId(securityId: string): Promise<Position | null>;
  updatePosition(position: Position): Promise<void>;
  deletePosition(securityId: string): Promise<void>;

  getQuotes(): Promise<Quote[]>;
  getQuoteBySecurityId(securityId: string): Promise<Quote | null>;
  updateQuote(quote: Quote): Promise<void>;
  getQuoteBySecurityIdAndDate(securityId: string, at: Date): Promise<Quote | null>;

  // Settings operations
  getSettings(): Promise<Settings>;
  updateMarketDataConfig(config: MarketDataConfig): Promise<void>;
  updateSettings(settings: Settings): Promise<void>;

  // Business operations
  getPortfolioValue(): Promise<PortfolioDTO>;
  transactBuy(securityId: string, quantity: number): Promise<void>;
  transactSell(securityId: string, quantity: number): Promise<void>;
  getValuationAtDate(at: Date): Promise<ValuationResponse>;
}
