Environments

Dev: Vercel preview, Supabase dev project, Neon branch.

Prod: Vercel prod, Supabase prod project, Neon primary.

Env Vars (example)

NEXT_PUBLIC_SUPABASE_URL=...

NEXT_PUBLIC_SUPABASE_ANON_KEY=...

SUPABASE_SERVICE_ROLE_KEY=...

DATABASE_URL=postgres://...

OPENAI_API_KEY=...

ENABLE_PGVECTOR=true

MODEL_BUCKET=models

MODEL_VERSION=current

Deploy Steps

Neon: create database, enable pgvector if used.

Supabase: init, push schema, create RLS; seed CSV.

Vercel: connect repo, set env vars, deploy.

ML Model: run GitHub Action “train-model”, upload artifacts, set MODEL_VERSION.

Schedule: Supabase cron “batch-infer” daily 2AM UTC.

Rollback

Set MODEL_VERSION to previous artifact; re-run batch-infer for fresh predictions.