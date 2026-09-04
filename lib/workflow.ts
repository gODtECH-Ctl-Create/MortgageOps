export const applicationStatuses = [
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

export type ApplicationStatus = (typeof applicationStatuses)[number];

const transitions: Record<ApplicationStatus, readonly ApplicationStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["DOCUMENT_REVIEW", "CANCELLED"],
  DOCUMENT_REVIEW: ["CREDIT_REVIEW", "CANCELLED"],
  CREDIT_REVIEW: ["PROPERTY_REVIEW", "CANCELLED"],
  PROPERTY_REVIEW: ["UNDERWRITING", "CANCELLED"],
  UNDERWRITING: ["APPROVAL", "CANCELLED"],
  APPROVAL: ["CONDITIONS", "REJECTED", "UNDERWRITING"],
  CONDITIONS: ["DISBURSEMENT_READY", "APPROVAL", "CANCELLED"],
  DISBURSEMENT_READY: ["DISBURSED", "CONDITIONS"],
  DISBURSED: ["ACTIVE"],
  ACTIVE: [],
  REJECTED: [],
  CANCELLED: [],
};

export class InvalidTransitionError extends Error {
  constructor(from: ApplicationStatus, to: ApplicationStatus) {
    super(`Invalid mortgage application transition: ${from} → ${to}`);
    this.name = "InvalidTransitionError";
  }
}

export function canTransition(from: ApplicationStatus, to: ApplicationStatus) {
  return transitions[from].includes(to);
}

export function transitionApplication(from: ApplicationStatus, to: ApplicationStatus) {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to);
  }

  return to;
}
