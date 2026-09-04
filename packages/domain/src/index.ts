export const MORTGAGE_APPLICATION_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "DOCUMENT_REVIEW",
  "CREDIT_REVIEW",
  "PROPERTY_REVIEW",
  "UNDERWRITING",
  "APPROVAL",
  "CONDITIONS",
  "DISBURSEMENT_READY",
  "DISBURSED",
  "ACTIVE",
  "REJECTED",
  "CANCELLED",
] as const;

export type MortgageApplicationStatus = (typeof MORTGAGE_APPLICATION_STATUSES)[number];

export type MortgageApplication = {
  id: string;
  applicationNumber: string;
  organizationId: string;
  primaryCustomerId: string;
  productId: string;
  requestedAmount: number;
  currency: "NGN";
  tenureMonths: number;
  status: MortgageApplicationStatus;
};

export type LoanLedgerEntry = {
  id: string;
  loanAccountId: string;
  amount: number;
  currency: "NGN";
  entryType: "DISBURSEMENT" | "PRINCIPAL" | "INTEREST" | "FEE" | "PENALTY" | "PAYMENT" | "REVERSAL" | "ADJUSTMENT";
  effectiveAt: string;
  postedAt: string;
  reference?: string;
};
