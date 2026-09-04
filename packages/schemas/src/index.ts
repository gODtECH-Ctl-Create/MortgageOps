import { z } from "zod";

export const CreateMortgageApplicationSchema = z.object({
  customerId: z.uuid(),
  productId: z.uuid(),
  requestedAmount: z.number().positive(),
  tenureMonths: z.number().int().positive(),
});

export const MoneySchema = z.object({
  amount: z.number().finite().positive(),
  currency: z.literal("NGN"),
});

export type CreateMortgageApplicationInput = z.infer<typeof CreateMortgageApplicationSchema>;
export type MoneyInput = z.infer<typeof MoneySchema>;
