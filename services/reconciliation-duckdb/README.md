# DuckDB Reconciliation Lab

This is an analyst-side, isolated reconciliation workspace.

The workflow is:

```text
Bank CSV / Parquet
        ↓
      DuckDB
        ↓
Normalize + match
        ↓
Matched / Unmatched / Suspense
        ↓
Export investigation result
```

DuckDB is not the financial system of record. It is a fast local analytical tool for investigations and ad-hoc finance work. DuckDB can operate directly on formats such as CSV, JSON and Parquet, including data in object storage. citeturn520539search9turn520539search14

Never execute untrusted SQL in this workspace without sandboxing; DuckDB's host capabilities mean query execution must be treated as privileged. citeturn520539search8
