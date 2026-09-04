# MortgageOps Architecture

## 1. Architectural Position

MortgageOps is an operational and financial-control layer around existing banking infrastructure.

The platform is intentionally polyglot: each major technology has a defined responsibility. We should not introduce a technology merely because it is popular.

```text
                         MortgageOps
                             │
             ┌───────────────┼────────────────┐
             │               │                │
          Web App          API             Workers
             │               │                │
        Next.js/React      NestJS       BullMQ + Redis
             │               │                │
             └───────────────┼────────────────┘
                             │
                       Domain Services
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    PostgreSQL            Storage             AI Service
    Supabase              S3-style             FastAPI
        │                 object store         Python
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                       Integrations
                             │
       ┌─────────────┬───────┼────────┬──────────────┐
       │             │                │              │
   Core Banking     KYC            Banking       Messaging
    /Loan System   Providers        /Payments     Email/SMS
```

## 2. Technology Stack

### Web application

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui for reusable enterprise interface primitives
- TanStack Table for data-heavy operational tables
- TanStack Query for server-state fetching/caching where needed
- React Hook Form for form state
- Zod for runtime validation and typed schemas
- Recharts for operational analytics

The web layer owns presentation, navigation, accessible interaction, and client-side experience. It must not become the system of record for financial logic.

### API layer

- NestJS
- TypeScript
- REST APIs for the primary integration surface
- OpenAPI for API documentation/contracts
- Zod/class-validator-based request validation depending on boundary
- Pino-based structured logging

The API owns authentication context, authorization, domain commands, workflow orchestration boundaries and integration ports.

### Primary data layer

- PostgreSQL as the transactional system of record
- Supabase for early managed Postgres, authentication and storage development
- SQL migrations as the authoritative database schema
- PostgreSQL functions only where they improve integrity or transaction safety

The core financial model remains relational. We do not introduce a second primary database without a concrete workload reason.

### ORM / query access

The first choice for application data access is a typed SQL layer around PostgreSQL. Drizzle can be introduced for developer ergonomics while SQL migrations remain authoritative.

We should not run Prisma, Drizzle and another ORM simultaneously in the same domain.

### Caching and background work

- Redis for transient cache, idempotency keys, rate-limit state and distributed job coordination
- BullMQ for asynchronous jobs and scheduled operational work

Example jobs:

- Document virus scan
- Document classification
- OCR extraction
- Reminder notifications
- Reconciliation imports
- Payment matching
- SLA escalation
- Daily portfolio snapshots
- Statement generation

### Document and file storage

- S3-compatible object storage for mortgage documents
- PostgreSQL stores metadata, ownership and verification state
- Signed URLs or server-mediated access for protected documents

Large binary files should not be stored directly in PostgreSQL.

### AI / document intelligence service

Use a separate Python service when AI or document-processing workloads justify it.

- FastAPI
- Python
- Pydantic
- OCR/document parsing libraries selected per document type
- Model provider abstraction so the product is not tied to one Artificial Intelligence (AI) vendor

Initial AI responsibilities:

- Document classification
- OCR-assisted field extraction
- Missing-document detection
- Document anomaly flags
- Credit-file summarization
- Analyst assistance

AI does not directly post financial transactions or make final credit approvals.

### Observability

- OpenTelemetry for traces and telemetry standards
- Sentry for application error monitoring
- Structured JSON logs
- Correlation IDs across web, API, workers and integrations

A mortgage case should be traceable across the system using a stable correlation identifier.

### Testing

- Vitest for unit and domain tests
- Playwright for browser end-to-end tests
- Supertest or API-level integration tests for HTTP boundaries
- Testcontainers for realistic PostgreSQL/Redis integration tests when required

Critical financial and workflow behavior must have automated tests before production use.

### Developer tooling

- pnpm for package/workspace management
- Turborepo for monorepo task orchestration
- ESLint
- Prettier
- TypeScript strict mode
- Docker for repeatable local and deployment environments
- GitHub Actions for Continuous Integration (CI)

## 3. Repository / Monorepo Direction

```text
MortgageOps/
├── app/                       # Next.js web application
├── components/                # Web UI components
├── lib/                       # Web/domain adapters
├── services/
│   ├── api/                   # NestJS API
│   ├── worker/                # BullMQ workers
│   └── ai/                    # FastAPI/Python document intelligence
├── packages/
│   ├── domain/                # Shared domain types and invariants
│   ├── schemas/               # Shared validation contracts
│   ├── ui/                    # Shared interface primitives
│   ├── config/                # Shared TypeScript/tooling config
│   └── integrations/          # Integration contracts/adapters
├── supabase/
│   └── migrations/            # Authoritative PostgreSQL migrations
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── infra/
│   ├── docker/
│   └── deployment/
├── .github/workflows/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

The existing root `app/` remains the initial web application while the service boundaries are introduced incrementally.

## 4. Domain Modules

```text
identity
organizations
customers
applications
documents
verification
credit
underwriting
properties
collateral
approvals
conditions
disbursements
loans
repayment
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

## 5. Core Data Model

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

## 6. Mortgage Case Relationship

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

## 7. Financial Ledger Principles

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

The financial core must enforce double-entry invariants and transaction atomicity at the database/service boundary.

## 8. Workflow Engine

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

For long-running workflows, the application should start with explicit domain state and BullMQ jobs. A workflow engine such as Temporal is a later option if workflow durability and cross-service orchestration justify the additional operational complexity.

## 9. Integration Strategy

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

Integration adapters should support retries, idempotency, timeouts, circuit breaking and audit references.

## 10. Security Model

Security requirements should include:

- Role-Based Access Control (RBAC)
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
- Rate limiting
- API request signing where required by integrations

## 11. Tenant Isolation

Every tenant-owned record must carry an organization boundary or inherit one through a validated relationship.

PostgreSQL Row Level Security (RLS) remains a database-level safety boundary. Service authorization must also enforce business permissions; RLS is not a substitute for application authorization.

## 12. Audit Model

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

## 13. Non-Functional Priorities

### Highest priority

Correctness of financial state, authorization, traceability and reliability.

### Next priority

Performance, workflow usability and integration reliability.

### Later optimization

Advanced analytics, Artificial Intelligence (AI) and platform-scale event streaming.

## 14. Eventing Strategy

The first release should use domain events and an outbox pattern for reliable asynchronous processing.

Example:

```text
Application submitted
        │
        ├── database transaction
        │
        └── outbox event
                │
                └── worker
                     ├── notification
                     ├── task creation
                     └── analytics update
```

Kafka or another distributed event streaming platform can be introduced later when transaction volume, integration fan-out or independent consumer workloads justify it. It is deliberately not a V1 dependency.

## 15. API and Contract Strategy

- REST/OpenAPI is the default external contract.
- Webhooks are used for asynchronous partner notifications.
- Shared schemas are versioned.
- Idempotency keys are mandatory for money-moving commands.
- Every external reference is persisted.

GraphQL should only be introduced for a proven frontend aggregation problem; it is not required for the first API surface.

## 16. AI Boundary

AI is an assistive service, not the system of record.

Appropriate uses:

- Document classification
- Data extraction
- Summarization
- Missing-document detection
- Exception explanation
- Analyst assistance

Final credit approvals, financial postings and other controlled decisions remain governed by deterministic rules and authorized human actions.

## 17. Technology Introduction Rule

A new technology must have a named problem, owner and failure strategy.

```text
Technology       Primary purpose
----------------------------------------------------
Next.js          Internal web application
NestJS           Domain/API service
PostgreSQL       Transactional source of truth
Supabase         Managed Postgres/auth/storage during early phases
Redis            Cache + transient coordination
BullMQ           Background jobs
FastAPI/Python   Document/AI processing
S3-compatible    Document object storage
OpenTelemetry    Distributed traces/telemetry
Sentry           Error monitoring
Vitest           Unit/domain tests
Playwright       End-to-end tests
Testcontainers   Integration environments
Docker           Reproducible services
pnpm/Turborepo   Monorepo tooling
GitHub Actions   CI automation
```

We intentionally defer Kafka, Temporal, GraphQL, Elasticsearch/OpenSearch, Kubernetes and additional databases until measurable requirements justify them.
