# MortgageOps

Mortgage Operations, Credit and Financial Control Platform for mortgage institutions.

## Product Vision

MortgageOps is an internal operating platform that helps a mortgage bank manage the full lifecycle of a mortgage from application through underwriting, property verification, approval, disbursement, servicing, collections, reconciliation, risk and reporting.

MortgageOps is designed to sit alongside an institution's existing core banking and payment infrastructure rather than attempting to replace the entire banking stack in the first release.

## Current Build

Phase 1 is now active. The repository contains:

- Product Requirements Document (PRD)
- Architecture specification
- Delivery roadmap
- Next.js / React / TypeScript application shell
- Mortgage control-tower dashboard prototype
- Mortgage application workflow state machine
- Money-domain primitives
- Initial Supabase PostgreSQL schema
- Organization-aware Row Level Security (RLS) policies
- Supabase browser client factory
- Workflow unit tests
- Continuous Integration (CI) for typecheck, tests and production build

## MVP Direction

The first release focuses on:

1. Application and customer case management
2. Document management
3. Credit and underwriting workflow
4. Property and collateral records
5. Approval workflows
6. Disbursement readiness
7. Loan ledger and repayment schedule
8. Payment reconciliation
9. Management dashboard

## Repository Structure

```text
MortgageOps/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
├── lib/
│   ├── money.ts
│   ├── supabase-browser.ts
│   └── workflow.ts
├── supabase/
│   └── migrations/
│       ├── 0001_initial_schema.sql
│       └── 0002_rls_policies.sql
├── tests/
│   └── workflow.test.ts
├── .github/workflows/ci.yml
├── .env.example
├── package.json
└── README.md
```

## Local Development

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

For validation:

```bash
npm run typecheck
npm test
npm run build
```

Copy `.env.example` to `.env.local` and provide the Supabase project URL and publishable key before wiring the application to a database.

## Financial Safety Principle

Financial state must be traceable. MortgageOps should preserve an auditable history of decisions, approvals, documents, financial transactions and workflow changes.

Financial corrections should be represented by compensating or reversing entries rather than silently overwriting posted financial history.

## Product Issue

Phase 1 implementation is tracked in GitHub Issue #1: `Phase 1: Build Mortgage Case Management Foundation`.
