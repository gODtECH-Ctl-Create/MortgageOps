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
     ┌───────────────────────┼────────────────────────┐
     │                       │                        │
 PostgreSQL              Rust Ledger              AI Service
 System of Record        Axum + Decimal            FastAPI
     │                       │                        │
     │                       └───────┐                │
     │                               │                │
     │                        NATS JetStream           │
     │                               │                │
     │                ┌──────────────┼──────────────┐ │
     │                │              │              │ │
     │             Elixir           Go          Analytics
     │             Phoenix      Integration       ClickHouse
     │             Live Ops      Gateway             │
     │                │              │             DuckDB
     │                │              │
     │                └──────────────┼──────────────┘
     │                               │
     │                         External Systems
     │
     └─────── OPA/Rego + WebAssembly Policy Runtime
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
- Lucide for interface icons

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

### Financial core

- Rust
- Axum HTTP service
- `rust_decimal` for fixed-precision financial arithmetic
- Tokio asynchronous runtime

Rust is reserved for code where correctness of money arithmetic, validation and controlled concurrency matter most. `rust_decimal` is specifically designed for fixed-precision financial calculations, while Axum provides the HTTP boundary for the service. citeturn388447search6turn520539search10turn534164search3

### Policy engine

Two policy execution paths are being explored:

1. Open Policy Agent (OPA) / Rego for human-readable, declarative policies.
2. WebAssembly (Wasm) for portable rule execution where the same deterministic policy must run in multiple environments. WebAssembly has standardized browser and non-browser embeddings, including WASI. citeturn520539search6

Credit decisions remain policy-governed and human-authorized. Policy engines calculate eligibility and exceptions; they do not self-authorize lending.

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

### Event transport

- NATS Core for lightweight messaging
- JetStream for durable domain-event streams
- Rust publisher in the first systems experiment

NATS is deliberately preferred for the first event-oriented experiments because it provides secure, high-performance messaging and JetStream durability without requiring a Kafka cluster on day one. citeturn520539search4turn388447search10

### Live operations

- Elixir
- Phoenix 1.8
- Phoenix PubSub
- Phoenix Channels / LiveView as the operational-realtime surface evolves

The Elixir runtime is a good fit for connected operator presence, live queues, notifications and soft-realtime case events. Phoenix Channels use PubSub for bidirectional soft-realtime messaging, and Phoenix 1.8.13 is the current maintained 1.8 line. citeturn400593search2turn617979search1

### Bank and external-system gateway

- Go
- Standard `net/http` first
- Provider-specific adapters isolated behind integration contracts

Go is used for low-dependency, long-running adapters that talk to core banking, payment, identity or verification providers. The Go toolchain currently has the 1.25.14 patch release available. citeturn388447search5

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

### Analytics

- ClickHouse for portfolio/event analytics and high-cardinality operational queries
- DuckDB for controlled local reconciliation and finance investigation workloads

ClickHouse is designed for high-throughput analytical ingestion and concurrent real-time queries. DuckDB is embedded and can work directly with CSV, JSON and Parquet, making it useful for investigator workflows without another always-on database. citeturn520539search2turn520539search9turn520539search14

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
│   ├── ledger-rust/           # Rust financial core
│   ├── event-bus-rust/        # Rust/NATS event publisher
│   ├── realtime-elixir/       # Elixir/Phoenix operational realtime
│   ├── integration-go/        # Go external-system gateway
│   ├── worker/                # BullMQ workers
│   ├── ai/                    # FastAPI/Python document intelligence
│   ├── analytics-clickhouse/  # Analytical schema + queries
│   ├── reconciliation-duckdb/ # Finance investigation workspace
│   ├── rules-wasm/            # WebAssembly deterministic rules
│   └── policy-opa/            # OPA/Rego policies
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
├── infra/
│   ├── docker/
│   └── deployment/
├── docs/
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

For long-running workflows, the application should start with explicit domain state and BullMQ jobs. Temporal is a later experiment for durable, multi-day orchestration if that workload becomes real.

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
                └── NATS JetStream
                     ├── Elixir live ops
                     ├── Go integration gateway
                     ├── ClickHouse analytics
                     └── notifications
```

Kafka remains a later option when event volume, partitioning requirements or ecosystem integrations justify it.

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
Technology              Primary purpose
-------------------------------------------------------
Next.js/React           Internal web application
NestJS                  Domain/API service
PostgreSQL              Transactional source of truth
Supabase                Managed Postgres/auth/storage
Rust/Axum               Financial core
rust_decimal            Fixed-precision money math
WebAssembly             Portable deterministic rules
OPA/Rego                Declarative policies
Redis                   Cache + transient coordination
BullMQ                  Background jobs
NATS JetStream          Durable domain events
Elixir/Phoenix          Live operations
Go                      External integration gateway
FastAPI/Python          Document/AI processing
S3-compatible storage   Protected mortgage documents
ClickHouse              Portfolio/event analytics
DuckDB                  Finance investigation workspace
OpenTelemetry            Distributed tracing
Sentry                  Error monitoring
Vitest                  Unit/domain tests
Playwright              End-to-end tests
Testcontainers           Integration environments
Docker                  Reproducible services
pnpm/Turborepo           Monorepo tooling
GitHub Actions           CI automation
```

We intentionally defer Kafka, Kubernetes, Elasticsearch/OpenSearch and additional primary databases until measurable requirements justify them.
