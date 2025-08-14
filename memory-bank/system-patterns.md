Architecture Overview

Frontend: Next.js 14(App Router) on Vercel.

Backend data services: Supabase (Auth, Row Level Security, storage, realtime), Neon Postgres (primary DB).

Vector store (optional in MVP): Pinecone for embeddings; can start with pgvector in Neon to reduce vendors.

Workflow integration: n8n hosted or cloud for Salesforce/Email/Calendar ingestion.

ML services: Python job (Batch training/inference on serverless or Supabase Functions/Edge; artifact storage in Supabase Storage).

Key Patterns

Data layering:

Raw layer: imported CSVs or n8n ingests (opportunities, interactions, transcripts).

Feature store: materialized views or tables (temporal, interaction, firmographic, MEDDICC signals).

Predictions: predictions table keyed by opportunity_id with model_version, proba, top_features.

Idempotent ETL: UPSERT by natural keys; audit columns (ingested_at, source_hash).

Inference:

Batch: nightly re-score all “open” opportunities.

On-demand: POST /api/predict recompute features for a single opp, return proba and top-k drivers.

Explainability:

Persist SHAP values (or permutation importances) for top features.

“Why” pane on detail page uses these plus MEDDICC coverage flags.

Benchmarks:

Cohort builder query: match on industry, product, deal size band(±20%), region, persona where outcome=won in last N months.

Precompute cohort aggregates for fast detail views.

Security:

Supabase RLS by org_id/account_id; API routes verify session JWT → supabase client for row-scoped queries.

Data Model (core tables)

accounts(id, org_id, name, industry, region, size_band, created_at)
opportunities(id, account_id, owner_id, product_category, amount, stage, created_at, close_date, outcome)
interactions(id, opportunity_id, type[email|phone|meeting|demo|support], channel, occurred_at, duration_min, outcome, meta_json)
transcripts(id, opportunity_id, occurred_at, text, embedding optional)
features_snapshot(opportunity_id, as_of, feature_json)
predictions(opportunity_id, as_of, model_version, proba_close, top_features_json)
benchmarks_cached(cohort_key, as_of, metrics_json)