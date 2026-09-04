create database if not exists mortgageops_analytics;

create table if not exists mortgageops_analytics.application_events
(
    organization_id UUID,
    application_id UUID,
    event_type LowCardinality(String),
    status LowCardinality(String),
    amount Decimal(20, 2),
    currency FixedString(3),
    actor_role LowCardinality(String),
    occurred_at DateTime64(3, 'UTC'),
    correlation_id UUID
)
engine = MergeTree
partition by toYYYYMM(occurred_at)
order by (organization_id, occurred_at, application_id)
settings index_granularity = 8192;

create table if not exists mortgageops_analytics.portfolio_daily
(
    organization_id UUID,
    snapshot_date Date,
    active_loans UInt64,
    outstanding_principal Decimal(24, 2),
    overdue_principal Decimal(24, 2),
    collected_amount Decimal(24, 2),
    unreconciled_amount Decimal(24, 2)
)
engine = ReplacingMergeTree(snapshot_date)
order by (organization_id, snapshot_date);
