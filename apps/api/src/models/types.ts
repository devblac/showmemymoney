export interface CashAccount {
  balance: number;
}

export interface Security {
  id: string;
  symbol: string;
  name: string;
  type: 'acción' | 'bono';
}

export interface Position {
  securityId: string;
  quantity: number;
}

export interface Quote {
  securityId: string;
  price: number;
  at: Date;
}

export interface PortfolioDTO {
  cash: CashAccount;
  positions: Array<{
    security: Security;
    quantity: number;
    unitPrice: number;
    valuation: number;
  }>;
  securities: Security[];
  totalValuation: number;
}

export interface TransactionRequest {
  securityId: string;
  quantity: number;
}

export interface QuoteUpdateRequest {
  securityId: string;
  price: number;
}

export interface ValuationResponse {
  totalValuation: number;
  at: Date;
}

export interface MarketDataConfig {
  source: 'hardcoded' | 'online';
  broker?: {
    id: number;
    dni: string;
    user: string;
    password: string;
  };
}

export interface Settings {
  marketData: MarketDataConfig;
  storage: {
    type: StorageType;
    postgresql?: {
      host: string;
      port: number;
      database: string;
      user: string;
      // Password should be handled securely, possibly through env vars
    };
  };
}