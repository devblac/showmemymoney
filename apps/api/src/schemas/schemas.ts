import { z } from 'zod';

export const TransactionRequestSchema = z.object({
  securityId: z.string().min(1, 'El ID del instrumento es requerido'),
  quantity: z.number().int().positive('La cantidad debe ser un número entero positivo'),
});

export const QuoteUpdateRequestSchema = z.object({
  securityId: z.string().min(1, 'El ID del instrumento es requerido'),
  price: z.number().positive('El precio debe ser un número positivo'),
});

export const ValuationQuerySchema = z.object({
  at: z.string().optional(),
});

export type TransactionRequest = z.infer<typeof TransactionRequestSchema>;
export type QuoteUpdateRequest = z.infer<typeof QuoteUpdateRequestSchema>;
export type ValuationQuery = z.infer<typeof ValuationQuerySchema>;