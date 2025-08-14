Stack

Frontend: Next.js 14, TypeScript, shadcn/ui, Tailwind, TanStack Query, Zustand for local state.

Hosting: Vercel.

Backend/data: Supabase (Auth, Storage, Realtime), Neon Postgres, Prisma or drizzle-orm.

Vector: pgvector in Neon for MVP; Pinecone later if scale/search UX needs it.

ML: Python (xgboost/lightgbm), scikit-learn, pandas; orchestration minimal (cron via GitHub Actions or Supabase Scheduled Functions), Evidently AI for drift monitoring when ready.

Automation: n8n for Salesforce/Email/Calendar; start with CSV importers for speed.

Local Dev

Node 20+, pnpm or npm.

.env.local: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL(Neon), OPENAI_API_KEY(optional), PINECONE_API_KEY(optional).

Database: Prisma migrate; seed script loads sample CSVs (opps, interactions, transcripts).

Build/Deploy

Vercel: monorepo single app; set env vars in Vercel dashboard.

Supabase: enable RLS; create policies per org_id.

Edge functions (optional): /predict for low-latency or proxy to a Python endpoint.

Data Ingestion (MVP order)

Step 1: CSV upload UI → server processes into raw tables.

Step 2: n8n flows for Salesforce reports → Supabase REST or direct Postgres.

Step 3: Email/Calendar → counts and response-time aggregations (no PII).

Observability

Sentry for frontend API routes.

Logflare/Vercel Analytics.

Model monitoring: start with periodic metrics CSVs; add Evidently AI later.