# MortgageOps Stack Lab

MortgageOps is intentionally using several languages and runtimes, but each one has a narrow job.

This is not microservices-for-microservices' sake. The financial system remains centered on PostgreSQL, while unusual technologies are isolated behind contracts so they can be replaced without rewriting the product.

## The unusual stack

| Technology | Job | Why it belongs |
|---|---|---|
| Rust + Axum | Financial ledger service | Strong type safety, explicit money arithmetic and predictable concurrency. `rust_decimal` is specifically designed for fixed-precision financial calculations. citeturn388447search6turn520539search10 |
| Rust + WebAssembly | Portable policy/rule execution | The same underwriting rule can be executed in controlled server runtimes and other environments. WebAssembly has standardized browser and non-browser embeddings, including WASI. citeturn520539search6 |
| Elixir + Phoenix/PubSub | Live operations | Phoenix Channels and PubSub provide a natural fit for live case queues, presence and operational notifications. Current Phoenix 1.8.13 and Phoenix PubSub 2.3.0 are actively maintained. citeturn617979search1turn400593search0 |
| Go | Bank/integration gateway | A small, boring, statically compiled integration process is ideal for long-running external-system adapters and health checks. Go 1.25 remains the supported modern toolchain line. citeturn388447search5 |
| NATS + JetStream | Domain event transport | Lightweight, secure messaging with durable JetStream semantics without making Kafka a day-one operational dependency. citeturn520539search4 |
| ClickHouse | Portfolio analytics | Column-oriented analytical workload with support for high-rate ingestion and concurrent analytical queries. citeturn520539search2 |
| DuckDB | Reconciliation/analyst workspace | Embedded analytics can directly work with CSV, JSON, Parquet and object storage, making it useful for finance investigations without adding another always-on database. citeturn520539search9turn520539search14 |
| Python + FastAPI | Document intelligence | Python remains the experimental edge for OCR, data extraction and model integrations while keeping AI outside the transaction core. |

## Data boundaries

```text
                           PostgreSQL
                       SYSTEM OF RECORD
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
   Rust Ledger             Domain Events          Audit
        │                     │
        │                  NATS/JetStream
        │               ┌─────┼──────┐
        │               │     │      │
        │           Elixir   Go   Analytics
        │           Live    Integrations  │
        │                         │      ┌┴────────┐
        │                         │   ClickHouse DuckDB
        │                         │
        │                     Bank/Core
        │                     Adapters
        │
     WebAssembly
   Rule execution
        │
  Credit/Underwriting
```

## Hard rule

Only PostgreSQL and the financial ledger service may establish authoritative financial state.

ClickHouse, DuckDB, Redis, NATS, AI services and WebAssembly execution are supporting systems. They must never become an alternate source of truth for posted money.

## Technologies deliberately deferred

Kafka, Kubernetes, Temporal, GraphQL, Elasticsearch/OpenSearch and additional primary databases are not V1 dependencies. They can be introduced when a measurable workload proves the need.

DuckDB must never execute untrusted analyst-provided SQL without sandboxing because its SQL execution can access powerful host capabilities. citeturn520539search8
