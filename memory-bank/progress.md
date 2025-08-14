Status (today)

Requirements and architecture defined.

MVP scope locked: list + detail analytics + predictions.

Data model and features defined; modeling approach set.

In Progress

Schema and seed scripts.

Feature materialization views.

Baseline model notebook and training workflow.

Blocked/Needs Input

Confirm Salesforce export fields for n8n phase.

Confirm whether to start with pgvector or Pinecone immediately.

Upcoming

Build Opportunity Detail UI (Activity, Velocity, Benchmarks, MEDDICC, Explain).

Implement inference endpoint and nightly batch job.

Add cohort cache job and benchmark overlays.

Decisions Log

Use Next.js 14 + Supabase + Neon.

Start with pgvector; Pinecone later if search UX demands.

Use XGBoost + isotonic calibration for probabilities.

