import {
  CashAccount,
  Security,
  Position,
  Quote,
  PortfolioDTO,
  ValuationResponse,
} from '../models/types.js';

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
  
  // Business operations
  getPortfolioValue(): Promise<PortfolioDTO>;
  transactBuy(securityId: string, quantity: number): Promise<void>;
  transactSell(securityId: string, quantity: number): Promise<void>;
  getValuationAtDate(at: Date): Promise<ValuationResponse>;
}