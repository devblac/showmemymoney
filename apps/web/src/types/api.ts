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
  security: Security;
  quantity: number;
  unitPrice: number;
  valuation: number;
}

export interface PortfolioResponse {
  cash: CashAccount;
  positions: Position[];
  securities: Security[];
  totalValuation: number;
}

export interface TransactionRequest {
  securityId: string;
  quantity: number;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
}

export interface QuoteUpdateRequest {
  securityId: string;
  price: number;
}

export interface ApiError {
  error: string;
}