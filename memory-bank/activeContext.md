Current Focus

Implement MVP “Opportunity Detail” analytics and live inference API, fed by seeded historical data.

Prioritize pgvector over Pinecone to reduce moving parts; abstractions allow later swap.

What’s Recently Done

Defined schema for opportunities/interactions/transcripts/predictions.

Designed feature set: temporal(velocity), interactions(freq/recency), MEDDICC coverage flags, firmographics, competitor mentions, sentiment (optional).

Drafted inference endpoint contract.

Next Steps

Build DB schema + seed data loader.

Create feature materialization job (SQL views + a serverless job writing features_snapshot).

Train baseline model (xgboost) on seed data; persist model.pkl to Supabase Storage; record model_version.

Implement /api/predict: load features for opp, call model, save predictions row, return payload.

Build Opportunity Detail UI: tabs for Activity, Velocity, Benchmarks, MEDDICC, Explain.

Add cohort benchmark query + cache job.

Decisions/In-Flight

Use Prisma with Neon; drizzle acceptable fallback.

Use serverless Python for training via GitHub Actions + storage artifact; inference from Node via Python subprocess is avoided—prefer a tiny Python endpoint or Supabase Edge Function with Py.

Keep embeddings optional in MVP; add for transcript search/semantic MEDDICC tagging later.

Risks

Sparse labels for closed-won vs closed-lost in early data; mitigate with synthetic plus careful model calibration (Platt or isotonic).

PII concerns from transcripts; enforce redaction in UI.