create extension if not exists pgcrypto;

create type public.user_role as enum (
  'ADMIN',
  'MORTGAGE_OFFICER',
  'CREDIT_ANALYST',
  'PROPERTY_OFFICER',
  'APPROVER',
  'FINANCE_OFFICER',
  'COLLECTIONS_OFFICER',
  'RISK_COMPLIANCE',
  'EXECUTIVE'
);

create type public.application_status as enum (
  'DRAFT',
  'SUBMITTED',
  'DOCUMENT_REVIEW',
  'CREDIT_REVIEW',
  'PROPERTY_REVIEW',
  'UNDERWRITING',
  'APPROVAL',
  'CONDITIONS',
  'DISBURSEMENT_READY',
  'DISBURSED',
  'ACTIVE',
  'REJECTED',
  'CANCELLED'
);

create type public.document_status as enum ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');
create type public.condition_status as enum ('OPEN', 'FULFILLED', 'WAIVED', 'REJECTED');
create type public.approval_decision as enum ('APPROVED', 'REJECTED', 'RETURNED');
create type public.loan_status as enum ('PENDING_DISBURSEMENT', 'ACTIVE', 'DELINQUENT', 'MATURED', 'CLOSED', 'WRITTEN_OFF');
create type public.ledger_entry_type as enum ('DISBURSEMENT', 'PRINCIPAL', 'INTEREST', 'FEE', 'PENALTY', 'PAYMENT', 'REVERSAL', 'ADJUSTMENT');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  country_code char(2) not null default 'NG',
  base_currency char(3) not null default 'NGN',
  created_at timestamptz not null default now()
);

create table public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id),
  full_name text not null,
  role public.user_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  customer_number text not null,
  customer_type text not null default 'INDIVIDUAL' check (customer_type in ('INDIVIDUAL', 'CORPORATE')),
  first_name text,
  last_name text,
  business_name text,
  email text,
  phone text,
  date_of_birth date,
  created_at timestamptz not null default now(),
  unique (organization_id, customer_number)
);

create table public.mortgage_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  code text not null,
  name text not null,
  annual_interest_rate numeric(7,4) not null check (annual_interest_rate >= 0),
  min_tenure_months integer not null check (min_tenure_months > 0),
  max_tenure_months integer not null check (max_tenure_months >= min_tenure_months),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  application_number text not null,
  primary_customer_id uuid not null references public.customers(id),
  product_id uuid not null references public.mortgage_products(id),
  status public.application_status not null default 'DRAFT',
  requested_amount numeric(20,2) not null check (requested_amount > 0),
  tenure_months integer not null check (tenure_months > 0),
  assigned_user_id uuid references public.app_users(id),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, application_number)
);

create table public.application_parties (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  customer_id uuid not null references public.customers(id),
  party_type text not null check (party_type in ('PRIMARY', 'CO_BORROWER', 'GUARANTOR')), 
  created_at timestamptz not null default now(),
  unique (application_id, customer_id, party_type)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  application_id uuid not null references public.applications(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  status public.document_status not null default 'PENDING',
  expires_on date,
  verified_by uuid references public.app_users(id),
  verified_at timestamptz,
  reviewer_note text,
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  application_id uuid not null references public.applications(id) on delete cascade,
  address text not null,
  city text,
  state text,
  property_type text not null,
  purchase_price numeric(20,2) check (purchase_price >= 0),
  current_valuation numeric(20,2) check (current_valuation >= 0),
  developer_name text,
  seller_name text,
  legal_status text,
  title_status text,
  insurance_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  application_id uuid not null references public.applications(id) on delete cascade,
  requested_by uuid not null references public.app_users(id),
  required_role public.user_role not null,
  decision public.approval_decision,
  decision_note text,
  decided_by uuid references public.app_users(id),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.conditions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  application_id uuid not null references public.applications(id) on delete cascade,
  title text not null,
  description text,
  status public.condition_status not null default 'OPEN',
  due_on date,
  fulfilled_at timestamptz,
  fulfilled_by uuid references public.app_users(id),
  created_at timestamptz not null default now()
);

create table public.loan_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  loan_number text not null,
  application_id uuid not null unique references public.applications(id),
  customer_id uuid not null references public.customers(id),
  principal_amount numeric(20,2) not null check (principal_amount > 0),
  outstanding_principal numeric(20,2) not null check (outstanding_principal >= 0),
  annual_interest_rate numeric(7,4) not null check (annual_interest_rate >= 0),
  tenure_months integer not null check (tenure_months > 0),
  status public.loan_status not null default 'PENDING_DISBURSEMENT',
  disbursed_at timestamptz,
  maturity_date date,
  created_at timestamptz not null default now(),
  unique (organization_id, loan_number)
);

create table public.repayment_schedule (
  id uuid primary key default gen_random_uuid(),
  loan_account_id uuid not null references public.loan_accounts(id) on delete cascade,
  installment_number integer not null,
  due_date date not null,
  principal_due numeric(20,2) not null default 0 check (principal_due >= 0),
  interest_due numeric(20,2) not null default 0 check (interest_due >= 0),
  fees_due numeric(20,2) not null default 0 check (fees_due >= 0),
  total_due numeric(20,2) generated always as (principal_due + interest_due + fees_due) stored,
  principal_paid numeric(20,2) not null default 0 check (principal_paid >= 0),
  interest_paid numeric(20,2) not null default 0 check (interest_paid >= 0),
  status text not null default 'DUE',
  unique (loan_account_id, installment_number)
);

create table public.ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  code text not null,
  name text not null,
  account_type text not null check (account_type in ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE')),
  currency char(3) not null default 'NGN',
  active boolean not null default true,
  unique (organization_id, code)
);

create table public.ledger_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  loan_account_id uuid references public.loan_accounts(id),
  entry_type public.ledger_entry_type not null,
  amount numeric(20,2) not null check (amount > 0),
  currency char(3) not null default 'NGN',
  effective_at timestamptz not null,
  posted_at timestamptz not null default now(),
  debit_account_id uuid not null references public.ledger_accounts(id),
  credit_account_id uuid not null references public.ledger_accounts(id),
  reference text,
  source text not null,
  reversal_of_id uuid references public.ledger_transactions(id),
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now(),
  check (debit_account_id <> credit_account_id)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  loan_account_id uuid references public.loan_accounts(id),
  amount numeric(20,2) not null check (amount > 0),
  currency char(3) not null default 'NGN',
  received_at timestamptz not null,
  external_reference text,
  status text not null default 'UNALLOCATED' check (status in ('UNALLOCATED', 'PARTIALLY_ALLOCATED', 'ALLOCATED', 'REVERSED')),
  source text,
  created_at timestamptz not null default now()
);

create table public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  loan_account_id uuid not null references public.loan_accounts(id),
  principal_amount numeric(20,2) not null default 0 check (principal_amount >= 0),
  interest_amount numeric(20,2) not null default 0 check (interest_amount >= 0),
  fee_amount numeric(20,2) not null default 0 check (fee_amount >= 0),
  penalty_amount numeric(20,2) not null default 0 check (penalty_amount >= 0),
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  actor_user_id uuid references public.app_users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  previous_state jsonb,
  new_state jsonb,
  correlation_id uuid,
  created_at timestamptz not null default now()
);

create index applications_status_idx on public.applications (organization_id, status);
create index applications_assignee_idx on public.applications (organization_id, assigned_user_id);
create index documents_application_idx on public.documents (application_id, status);
create index loan_accounts_status_idx on public.loan_accounts (organization_id, status);
create index payments_status_idx on public.payments (organization_id, status);
create index ledger_transactions_loan_idx on public.ledger_transactions (loan_account_id, posted_at);
create index audit_events_entity_idx on public.audit_events (organization_id, entity_type, entity_id, created_at desc);

-- Supabase Row Level Security (RLS) is enabled for tenant-facing tables.
-- Policies will be introduced with the authentication implementation so that
-- development does not accidentally ship with over-permissive access.

alter table public.app_users enable row level security;
alter table public.customers enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;
alter table public.properties enable row level security;
alter table public.approval_requests enable row level security;
alter table public.conditions enable row level security;
alter table public.loan_accounts enable row level security;
alter table public.repayment_schedule enable row level security;
alter table public.ledger_accounts enable row level security;
alter table public.ledger_transactions enable row level security;
alter table public.payments enable row level security;
alter table public.payment_allocations enable row level security;
alter table public.audit_events enable row level security;
