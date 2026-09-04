create or replace function public.current_user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.app_users
  where id = auth.uid()
    and active = true
  limit 1;
$$;

alter table public.organizations enable row level security;
alter table public.mortgage_products enable row level security;

create policy organization_self_access
on public.organizations
for select
to authenticated
using (id = public.current_user_org_id());

create policy app_users_same_organization
on public.app_users
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy mortgage_products_same_organization
on public.mortgage_products
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy customers_same_organization
on public.customers
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy applications_same_organization
on public.applications
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy documents_same_organization
on public.documents
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy properties_same_organization
on public.properties
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy approval_requests_same_organization
on public.approval_requests
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy conditions_same_organization
on public.conditions
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy loan_accounts_same_organization
on public.loan_accounts
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy repayment_schedule_same_organization
on public.repayment_schedule
for all
to authenticated
using (
  exists (
    select 1
    from public.loan_accounts l
    where l.id = repayment_schedule.loan_account_id
      and l.organization_id = public.current_user_org_id()
  )
)
with check (
  exists (
    select 1
    from public.loan_accounts l
    where l.id = repayment_schedule.loan_account_id
      and l.organization_id = public.current_user_org_id()
  )
);

create policy ledger_accounts_same_organization
on public.ledger_accounts
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy ledger_transactions_same_organization
on public.ledger_transactions
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy payments_same_organization
on public.payments
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());

create policy payment_allocations_same_organization
on public.payment_allocations
for all
to authenticated
using (
  exists (
    select 1
    from public.payments p
    where p.id = payment_allocations.payment_id
      and p.organization_id = public.current_user_org_id()
  )
)
with check (
  exists (
    select 1
    from public.payments p
    where p.id = payment_allocations.payment_id
      and p.organization_id = public.current_user_org_id()
  )
);

create policy audit_events_same_organization
on public.audit_events
for all
to authenticated
using (organization_id = public.current_user_org_id())
with check (organization_id = public.current_user_org_id());
