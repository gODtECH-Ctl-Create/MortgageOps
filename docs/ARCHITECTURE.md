# MortgageOps Architecture

## 1. Architectural Position

MortgageOps is an operational layer around existing banking infrastructure.

```text
                    MortgageOps
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Operations       Financial Control    Risk
        │                │                │
 Application         Loan Ledger       Compliance
 Documents           Payments          Audit
 Credit              Reconciliation   Exceptions
 Property
 Approval
 Collections
        │                │                │
        └────────────────┼────────────────┘
                         │
                 Integration Layer
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
   Core Banking     Identity/KYC       Banking Data
   / Loan System    / Verification     / Payments
```

## 2. Recommended Technology Direction

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- TypeScript service layer
- PostgreSQL
- Supabase can be used for early development and prototyping, with production deployment architecture reviewed separately for institutional requirements.

### Storage

- Object storage for controlled document storage
- PostgreSQL for metadata and business records

### Authentication and Authorization

- Central authentication service
- Role-Based Access Control (RBAC)
- Fine-grained permissions
- Multi-Factor Authentication (MFA) for privileged users
- Session controls

## 3. Domain Modules

```text
identity
customers
applications
documents
credit
properties
approvals
disbursements
loans
ledger
payments
reconciliation
collections
risk
compliance
audit
reporting
notifications
integrations
```

Modules should have clear domain boundaries. Financial transactions must not be implemented as ordinary mutable CRUD records where historical state can silently change.

## 4. Core Data Model

### Main entities

```text
Organization
User
Role
Permission
Customer
PartyRelationship
MortgageProduct
Application
ApplicationParty
Document
DocumentRequirement
Verification
CreditAssessment
UnderwritingDecision
Property
Valuation
Collateral
ApprovalRequest
ApprovalDecision
Condition
Disbursement
LoanAccount
RepaymentSchedule
LedgerAccount
LedgerTransaction
Payment
PaymentAllocation
BankTransaction
ReconciliationMatch
CollectionCase
Task
Exception
AuditEvent
Notification
IntegrationEndpoint
ExternalReference
```

## 5. Mortgage Case Relationship

```text
Customer
   │
   └── Application
          │
          ├── Documents
          ├── Verification
          ├── Credit Assessment
          ├── Property
          │      └── Valuation / Collateral
          ├── Approval
          │      └── Conditions
          └── Disbursement
                 │
                 └── Loan Account
                        ├── Repayment Schedule
                        ├── Payments
                        ├── Ledger Transactions
                        ├── Reconciliation
                        └── Collections
```

## 6. Financial Ledger Principles

The loan ledger must be append-oriented and auditable.

A financial transaction should have:

- Unique transaction identifier
- Transaction type
- Amount
- Currency
- Effective date
- Posting date
- Source
- Reference
- Debit account
- Credit account
- Loan reference where applicable
- Created-by identity
- Reversal relationship where applicable

Corrections should use compensating or reversing transactions rather than silently overwriting financial history.

## 7. Workflow Engine

Workflows should support:

- States
- Transitions
- Preconditions
- Required tasks
- Approvers
- Service-level deadlines
- Escalation
- Rejection
- Return-for-correction
- Audit events

Example:

```text
DRAFT
  ↓
SUBMITTED
  ↓
DOCUMENT_REVIEW
  ↓
CREDIT_REVIEW
  ↓
PROPERTY_REVIEW
  ↓
UNDERWRITING
  ↓
APPROVAL
  ↓
CONDITIONS
  ↓
DISBURSEMENT_READY
  ↓
DISBURSED
  ↓
ACTIVE
  ↓
MATURED / CLOSED
```

Exception paths must be first-class states rather than informal notes.

## 8. Integration Strategy

Use adapters around external systems.

```text
MortgageOps Domain
       │
   Integration Port
       │
   Adapter Layer
       │
 ┌─────┼──────────────┐
 │     │              │
Core  KYC           Banking
Loan  Provider      / Payment
System
```

This keeps the product independent of any one vendor and supports later bank-specific integrations.

## 9. Security Model

Security requirements should include:

- RBAC
- Least-privilege permissions
- Segregation of duties
- Maker-checker controls
- Encryption in transit and at rest
- Secure document access
- Full audit trails
- Privileged-action logging
- Backup and disaster recovery
- Controlled data export
- Environment separation
- Secrets management

## 10. Audit Model

Important business events should create audit events, including:

- Application creation and changes
- Document upload / verification
- Underwriting changes
- Approval and rejection
- Condition changes
- Disbursement authorization
- Financial posting
- Payment allocation
- Reconciliation decisions
- Permission changes
- Configuration changes

Audit records should capture actor, action, timestamp, entity, previous state where appropriate, new state where appropriate, and correlation/reference identifier.

## 11. Non-Functional Priorities

### Highest priority

Correctness of financial state, authorization, traceability and reliability.

### Next priority

Performance, workflow usability and integration reliability.

### Later optimization

Advanced analytics and artificial intelligence (AI) capabilities.

## 12. AI Boundary

AI is an assistive service, not the system of record.

Appropriate MVP uses:

- Document classification
- Data extraction
- Summarization
- Missing-document detection
- Exception explanation
- Analyst assistance

Final credit approvals, financial postings and other controlled decisions remain governed by deterministic rules and authorized human actions.
