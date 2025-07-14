import { Security } from './api';

export interface ExtendedPosition {
  security: Security;
  quantity: number;
  unitPrice: number;
  valuation: number;
}
