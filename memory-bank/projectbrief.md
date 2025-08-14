title: AI Sales Stack Ranker — Predictive Opportunity Analytics
owner: product+eng
status: active
last_updated: 2025-08-14

Project Brief
Goal
Transform the ai-sales-stack-ranker mock-up into a production-ready Next.js app on Vercel with Supabase/Neon, delivering:

Predictive close probability for opportunities.

Opportunity drilldowns with activity, velocity, MEDDICC scoring, and benchmark comparisons.

Batch and on-demand inference endpoints with explainability.

Why Now
Current sales pipelines are descriptive, not predictive.

Teams need actionable insights: risk detection, benchmarks vs. closed-won cohorts, and recommended next actions.

Users and Jobs
Sales leaders: improve forecast accuracy; surface at-risk, high-value deals with reasons and remediation.

AEs/SDRs: identify next-best actions; see how an opp compares to similar wins; remove guesswork.

RevOps: monitor data quality, model performance, and drift.

MVP Scope
Auth + org/team structure.

Opportunity list with ranker (probability, top drivers, aging).

Opportunity detail: customer activity, deal velocity timeline, MEDDICC radar, cohort benchmarks, risk/next-actions.

CSV ingestion (seed), feature materialization, batch/on-demand predictions.

Out-of-Scope (MVP)
Full bi-directional CRM sync.

Live call transcription; use uploaded transcripts or later Gong/Chorus integration.

Complex RBAC beyond org-level access.

Success Criteria
Deployed on Vercel; Supabase/Neon connected.

Inference live with P50<150ms, AUC≥0.80 on holdout; UI loads <2s.

Opportunity detail delivers the four core analytics (activity, velocity, MEDDICC, benchmarks) with explainability.