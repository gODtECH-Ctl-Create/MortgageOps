# MortgageOps Product Requirements Document (PRD)

## 1. Product Definition

**MortgageOps** is a mortgage operations, credit and financial-control platform for mortgage banks and other mortgage-lending institutions.

Its job is to give teams one controlled workflow for moving a mortgage case from application to active loan management while preserving document, decision and financial auditability.

### Product thesis

Mortgage institutions do not only need a place to store applications. They need a system that coordinates people, documents, approvals, property checks, money movement and exceptions across the mortgage lifecycle.

## 2. Primary Users

### Relationship / Mortgage Officer
Owns customer onboarding, application creation, communication and document follow-up.

### Credit Analyst / Underwriter
Reviews income, affordability, credit information, supporting documents and policy eligibility.

### Legal / Property Officer
Manages property information, title and legal checks, valuation and collateral conditions.

### Credit Approver / Committee
Reviews cases within delegated approval limits and records decisions and conditions.

### Finance Officer
Controls disbursement readiness, payment allocation, reconciliation, loan ledger activity and financial exceptions.

### Collections Officer
Manages overdue accounts, contact activities, promises to pay, escalations and recovery cases.

### Risk / Compliance Officer
Monitors policy exceptions, audit trails, customer verification status, suspicious activity workflows and portfolio risks.

### Executive / Management
Needs portfolio, pipeline, operational, financial and risk visibility.

## 3. Problem Statement

Mortgage processing is commonly fragmented across forms, spreadsheets, email, document folders, banking systems and separate operational teams. This creates delays, weak ownership, duplicated work, difficult reconciliations and poor visibility into exceptions.

MortgageOps should provide a single operational case record and a controlled workflow around the existing banking infrastructure.

## 4. Goals

1. Reduce mortgage processing time.
2. Make every application and loan case traceable.
3. Reduce missing-document and approval bottlenecks.
4. Standardize credit and property workflows.
5. Improve disbursement control.
6. Maintain an auditable mortgage financial ledger.
7. Automate payment matching and reconciliation.
8. Surface operational and portfolio exceptions early.
9. Provide management with near-real-time mortgage operations visibility.

## 5. Non-Goals for MVP

- Replacing the institution's entire core banking system.
- Building a card, ATM or payment-switch platform.
- Operating as a bank deposit ledger.
- Fully autonomous AI-driven credit approval.
- Building every regulatory reporting workflow on day one.

## 6. Core Workflow

```text
Lead / Customer
    ↓
Application
    ↓
Document Collection
    ↓
Customer Verification
    ↓
Credit Assessment
    ↓
Property / Collateral Assessment
    ↓
Underwriting
    ↓
Approval
    ↓
Conditions Fulfilment
    ↓
Disbursement
    ↓
Loan Servicing
    ↓
Repayment
    ↓
Payment Allocation
    ↓
Reconciliation
    ↓
Collections / Recovery when required
    ↓
Portfolio Reporting
```

## 7. MVP Modules

### 7.1 Customer and Application Management

Capabilities:
- Customer profile
- Individual and corporate applicants
- Co-borrowers / guarantors where applicable
- Mortgage application creation
- Product selection
- Requested amount and tenure
- Application status and ownership
- Tasks and next actions
- Full activity timeline

### 7.2 Document Management

Capabilities:
- Secure document upload
- Document types and categories
- Required-document checklist
- Verification status
- Expiry dates
- Versioning
- Reviewer notes
- Missing-document alerts

Future capability:
- Optical Character Recognition (OCR)
- Artificial Intelligence (AI)-assisted extraction and anomaly detection

### 7.3 Credit and Underwriting

Capabilities:
- Income and expense capture
- Existing obligations
- Affordability calculations
- Debt-service metrics
- Loan-to-value calculations
- Credit assessment summary
- Configurable underwriting rules
- Exceptions and overrides
- Recommendation
- Supporting evidence

AI may summarize or flag evidence but should not independently make final credit decisions in MVP.

### 7.4 Property and Collateral

Capabilities:
- Property master record
- Location and property type
- Purchase price
- Valuation
- Loan-to-value
- Developer / seller information
- Legal verification status
- Title documentation
- Insurance status
- Collateral status
- Expiry and renewal alerts

### 7.5 Approvals and Controls

Capabilities:
- Approval hierarchy
- Delegated limits
- Maker-checker workflow
- Credit committee workflow
- Approval conditions
- Rejection and return-for-correction
- Approval history
- Immutable audit events

### 7.6 Disbursement

Capabilities:
- Conditions checklist
- Readiness assessment
- Disbursement instruction
- Approval confirmation
- Disbursement status
- External system reference
- Post-disbursement verification

### 7.7 Loan Ledger and Servicing

Capabilities:
- Loan account
- Principal balance
- Interest configuration
- Fees
- Penalties
- Repayment schedule
- Payment history
- Outstanding balance
- Transaction history
- Loan status

### 7.8 Reconciliation

Capabilities:
- Import or receive bank transactions
- Auto-match expected payments
- Manual matching
- Partial / over / under payment handling
- Unapplied cash queue
- Suspense tracking
- Reconciliation status
- Daily reconciliation dashboard

### 7.9 Collections

Capabilities:
- Delinquency buckets
- Collection tasks
- Customer contact history
- Promise-to-pay tracking
- Escalations
- Recovery case management
- Portfolio collections dashboard

### 7.10 Risk, Compliance and Audit

Capabilities:
- Role-based access
- Segregation of duties
- Full audit trail
- Policy exceptions
- Customer verification status
- Approval overrides
- Case notes
- Audit export

### 7.11 Management Dashboard

Capabilities:
- Application pipeline
- Approval turnaround time
- Disbursement pipeline
- Active loan portfolio
- Outstanding principal
- Repayment performance
- Delinquency
- Reconciliation exceptions
- Document bottlenecks
- Branch / team performance

## 8. Key Product Concepts

### Mortgage Case
The central operational object. It connects the customer, application, property, documents, credit assessment, approvals, disbursement and loan account.

### Loan Account
The financial object created after approved disbursement. It maintains the contractual and transactional state of the mortgage.

### Exception
Any item that requires human attention because it is missing, overdue, mismatched, outside policy or otherwise unresolved.

### Task
A specific action assigned to a person or team with a status, due date and audit history.

## 9. Success Metrics

### Operational
- Application-to-decision turnaround time
- Decision-to-disbursement turnaround time
- Percentage of applications complete on first submission
- Average outstanding tasks per case

### Financial control
- Percentage of payments automatically matched
- Value of unreconciled transactions
- Number of suspense items
- Ledger-to-bank reconciliation completion rate

### Portfolio
- Delinquency rate
- Collection rate
- Outstanding principal
- Portfolio by product / branch / risk band

### Adoption
- Weekly active staff users
- Cases processed through MortgageOps
- Percentage of mortgage workflow handled in system

## 10. MVP Acceptance Principles

- A mortgage officer can create and submit a complete case.
- Credit staff can review evidence and record an underwriting decision.
- Property and legal staff can manage collateral conditions.
- Approvers can approve, reject or return a case with a complete decision trail.
- Finance can determine whether a case is ready for disbursement.
- A disbursed loan has a traceable financial ledger and repayment schedule.
- Incoming payments can be matched to loans and exceptions surfaced.
- Management can identify blocked cases and major financial exceptions without manual spreadsheet consolidation.
