-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" SERIAL NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "region" TEXT,
    "size_band" TEXT,
    "domain" TEXT,
    "website" TEXT,
    "employees" INTEGER,
    "revenue_range" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Opportunity" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "owner_id" TEXT NOT NULL,
    "product_category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "stage" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "close_date" TIMESTAMP(3) NOT NULL,
    "outcome" TEXT,
    "title" TEXT,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "source_id" INTEGER,
    "pipeline_id" INTEGER,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interaction" (
    "id" SERIAL NOT NULL,
    "opportunity_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_min" INTEGER,
    "outcome" TEXT,
    "meta_json" TEXT,
    "subject" TEXT,
    "contact_id" INTEGER,
    "rep_id" TEXT,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transcript" (
    "id" SERIAL NOT NULL,
    "opportunity_id" INTEGER NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "speaker" TEXT,
    "sentiment" DOUBLE PRECISION,
    "key_topics" TEXT[],

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FeatureSnapshot" (
    "opportunity_id" INTEGER NOT NULL,
    "as_of" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feature_json" TEXT NOT NULL,

    CONSTRAINT "FeatureSnapshot_pkey" PRIMARY KEY ("opportunity_id","as_of")
);

-- CreateTable
CREATE TABLE "public"."Prediction" (
    "opportunity_id" INTEGER NOT NULL,
    "as_of" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model_version" TEXT NOT NULL,
    "proba_close" DOUBLE PRECISION NOT NULL,
    "top_features_json" TEXT NOT NULL,
    "confidence_score" DOUBLE PRECISION,
    "predicted_close_date" TIMESTAMP(3),
    "risk_factors" TEXT[],

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("opportunity_id","as_of")
);

-- CreateTable
CREATE TABLE "public"."BenchmarkCached" (
    "cohort_key" TEXT NOT NULL,
    "as_of" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metrics_json" TEXT NOT NULL,

    CONSTRAINT "BenchmarkCached_pkey" PRIMARY KEY ("cohort_key","as_of")
);

-- CreateTable
CREATE TABLE "public"."Rep" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "quota" DOUBLE PRECISION,
    "region" TEXT,
    "territory" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pipeline" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stage_order" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Source" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "cost" DOUBLE PRECISION,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "department" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "linkedin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" SERIAL NOT NULL,
    "opportunity_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SalesStack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "pricing_json" JSONB,
    "features_json" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StackReview" (
    "id" SERIAL NOT NULL,
    "stack_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "pros" TEXT,
    "cons" TEXT,
    "use_case" TEXT,
    "reviewer" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StackReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StackRanking" (
    "id" SERIAL NOT NULL,
    "stack_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL,
    "criteria_json" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StackRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Analytics" (
    "id" SERIAL NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rep_id" TEXT,
    "source_id" INTEGER,
    "pipeline_id" INTEGER,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "public"."Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_domain_key" ON "public"."Account"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Rep_email_key" ON "public"."Rep"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pipeline_name_key" ON "public"."Pipeline"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Source_name_key" ON "public"."Source"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SalesStack_name_key" ON "public"."SalesStack"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StackRanking_stack_id_category_period_key" ON "public"."StackRanking"("stack_id", "category", "period");

-- AddForeignKey
ALTER TABLE "public"."Opportunity" ADD CONSTRAINT "Opportunity_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Opportunity" ADD CONSTRAINT "Opportunity_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."Rep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Opportunity" ADD CONSTRAINT "Opportunity_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "public"."Pipeline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Opportunity" ADD CONSTRAINT "Opportunity_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "public"."Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "public"."Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_rep_id_fkey" FOREIGN KEY ("rep_id") REFERENCES "public"."Rep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transcript" ADD CONSTRAINT "Transcript_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "public"."Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "public"."Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackReview" ADD CONSTRAINT "StackReview_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "public"."SalesStack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackRanking" ADD CONSTRAINT "StackRanking_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "public"."SalesStack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analytics" ADD CONSTRAINT "Analytics_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "public"."Pipeline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analytics" ADD CONSTRAINT "Analytics_rep_id_fkey" FOREIGN KEY ("rep_id") REFERENCES "public"."Rep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Analytics" ADD CONSTRAINT "Analytics_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

