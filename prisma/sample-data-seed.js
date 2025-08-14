// prisma/sample-data-seed.js
// Seed script for AI Sales Stack Ranker using your sample TypeScript data structure (converted here to JS)

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Load your TypeScript sample data file by importing the compiled JS or reading JSON.
// Easiest: export JSON from your TS file or paste the arrays here.
// If your sample-data.ts is not compiled to JS, create sample-data.json and read it instead.

const dataPath = path.join(process.cwd(), 'lib', 'sample-data.json')
// sample-data.json should contain: { stages: [...], sampleOpportunities: [...], sampleRepMetrics: [...] }

function parseISODate(d) {
  // Accepts 'YYYY-MM-DD' and returns Date
  return d ? new Date(d) : null
}

async function upsertDefaultPipeline(stages) {
  const stageOrder = stages && stages.length ? stages : [
    'Qualification (SAL)',
    'Discovery (SAO)',
    'Consensus / Demo',
    'Proof of Value',
    'Business Negotiation',
    'Legal Review',
    'Closed Won',
    'Closed Lost'
  ]

  const pipeline = await prisma.pipeline.upsert({
    where: { name: 'Default Pipeline' },
    update: { stage_order: stageOrder },
    create: {
      name: 'Default Pipeline',
      description: 'Pipeline created from seed script',
      stage_order: stageOrder
    }
  })
  return pipeline
}

async function upsertRep(name, email, role, region, quota) {
  // Use name as the unique identifier when email missing in the sample
  // If your schema requires email unique, we’ll synthesize one if not provided
  const safeEmail = email || `${name.toLowerCase().replace(/\\s+/g, '.')}@example.com`
  return prisma.rep.upsert({
    where: { email: safeEmail },
    update: {
      name,
      title: role || null,
      region: region || null,
      quota: quota || null,
    },
    create: {
      email: safeEmail,
      name,
      title: role || null,
      region: region || null,
      quota: quota || null,
    }
  })
}

async function upsertAccount(name, region, industry) {
  // Minimal account creation based on your sample
  return prisma.account.upsert({
    where: { name },
    update: {
      region: region || null,
      industry: industry || null,
    },
    create: {
      org_id: `ORG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name,
      region: region || null,
      industry: industry || null,
    }
  })
}

async function upsertSource(name) {
  if (!name) return null
  return prisma.source.upsert({
    where: { name },
    update: {},
    create: {
      name,
      type: 'inbound', // default; you can map specific types if you like
      category: 'digital'
    }
  })
}

async function insertOpportunity(item, rep, account, source, pipeline) {
  // Map fields from your sample
  const opp = await prisma.opportunity.create({
    data: {
      title: item.name,
      product_category: item.product_category,
      description: null,
      amount: item.amount,
      stage: item.stage,
      probability: typeof item.predictionScore === 'number' ? Math.min(Math.max(item.predictionScore / 100, 0), 1) : 0.5,
      priority: 'medium', // keep model's field; healthScore will go into Analytics
      close_date: parseISODate(item.closeDate) || new Date(),
      created_at: parseISODate(item.createdDate) || new Date(),
      account: { connect: { id: account.id } },
      rep: { connect: { id: rep.id } },
      source: source ? { connect: { id: source.id } } : undefined,
      pipeline: pipeline ? { connect: { id: pipeline.id } } : undefined,
    }
  })

  // Analytics: prediction score and health score
  if (typeof item.predictionScore === 'number') {
    await prisma.analytics.create({
      data: {
        metric: 'prediction_score',
        value: item.predictionScore,
        period: item.fiscalPeriod || 'unknown',
        period_start: new Date(),
        period_end: new Date(),
        metadata_json: { owner: item.owner, region: item.region, opportunity_id: opp.id },
        rep_id: rep?.id,
        source_id: source?.id,
        pipeline_id: pipeline?.id,
      }
    })
  }

  if (item.healthScore) {
    const scoreMap = { high: 3, medium: 2, low: 1 }
    await prisma.analytics.create({
      data: {
        metric: 'health_score',
        value: scoreMap[item.healthScore] || 0,
        period: item.fiscalPeriod || 'unknown',
        period_start: new Date(),
        period_end: new Date(),
        metadata_json: { owner: item.owner, region: item.region, opportunity_id: opp.id },
        rep_id: rep?.id,
        source_id: source?.id,
        pipeline_id: pipeline?.id,
      }
    })
  }

  return opp
}

async function seed() {
  console.log('🌱 Seeding database from sample-data.json...')
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Missing data file at ${dataPath}. Create data/sample-data.json from your TypeScript arrays.`)
  }

  const raw = fs.readFileSync(dataPath, 'utf8')
  const json = JSON.parse(raw)

  const stages = json.stages || []
  const sampleOpportunities = json.sampleOpportunities || []
  const sampleRepMetrics = json.sampleRepMetrics || []

  // 1) Pipeline
  const pipeline = await upsertDefaultPipeline(stages)

  // 2) Pre-create Reps from sampleRepMetrics to guarantee owner matching
  const repCache = new Map()
  for (const rm of sampleRepMetrics) {
    const rep = await upsertRep(rm.name, rm.email, rm.role, rm.region, rm.quota)
    repCache.set(rm.name, rep)
  }

  // 3) Iterate opportunities
  for (const item of sampleOpportunities) {
    // Rep by owner name; if not in metrics list, upsert on the fly
    let rep = repCache.get(item.owner)
    if (!rep) {
      rep = await upsertRep(item.owner, null, item.ownerRole, item.region, null)
      repCache.set(item.owner, rep)
    }

    const account = await upsertAccount(item.accountName, item.region, null)
    const source = await upsertSource(item.source)

    await insertOpportunity(item, rep, account, source, pipeline)
  }

  // 4) Seed aggregated Rep metrics into Analytics
  for (const rm of sampleRepMetrics) {
    const rep = repCache.get(rm.name)
    if (!rep) continue

    const metrics = [
      ['total_calls', rm.totalCalls],
      ['calls_per_week', rm.callsPerWeek],
      ['time_on_calls', rm.timeOnCalls],
      ['avg_call_duration', rm.avgCallDuration],
      ['opportunities', rm.opportunities],
      ['pipeline_value', rm.pipelineValue],
      ['closed_won', rm.closedWon],
      ['win_rate', rm.winRate],
      ['avg_deal_size', rm.avgDealSize],
      ['quota', rm.quota],
      ['quota_attainment', rm.quotaAttainment],
    ]

    for (const [metric, value] of metrics) {
      if (typeof value !== 'number') continue
      await prisma.analytics.create({
        data: {
          metric,
          value,
          period: 'seed',
          period_start: new Date(),
          period_end: new Date(),
          rep_id: rep.id,
          metadata_json: { region: rm.region, role: rm.role },
        }
      })
    }
  }

  console.log('✅ Seed complete.')
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
