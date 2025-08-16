// src/server/dal/postgres.ts
// Postgres DAL implementation using Prisma ORM

import { PrismaClient } from '@prisma/client'
import { 
  IDAL, 
  IOpportunityDAL, 
  IRepMetricsDAL, 
  IConfigDAL,
  OpportunityRecord, 
  RepMetricsRecord, 
  OpportunityFilters 
} from './index'

// Initialize Prisma client
const prisma = new PrismaClient()

// Utility functions
const formatDateString = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const calculateAge = (createdDate: Date): number => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const mapHealthScore = (healthValue: number): "high" | "medium" | "low" => {
  if (healthValue >= 3) return "high"
  if (healthValue >= 2) return "medium"
  return "low"
}

const determineFiscalPeriod = (date: Date): string => {
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  
  if (month >= 1 && month <= 3) return `Q1-${year}`
  if (month >= 4 && month <= 6) return `Q2-${year}`
  if (month >= 7 && month <= 9) return `Q3-${year}`
  return `Q4-${year}`
}

class PostgresOpportunityDAL implements IOpportunityDAL {
  async getAllOpportunities(filters?: OpportunityFilters): Promise<OpportunityRecord[]> {
    try {
      const whereClause: any = {}

      if (filters?.stage) {
        whereClause.stage = filters.stage
      }

      if (filters?.rep) {
        whereClause.rep = { name: filters.rep }
      }

      if (filters?.region) {
        whereClause.rep = { 
          ...whereClause.rep,
          region: filters.region 
        }
      }

      if (filters?.dateRange) {
        whereClause.created_at = {
          gte: filters.dateRange.start,
          lte: filters.dateRange.end
        }
      }

      const opportunities = await prisma.opportunity.findMany({
        where: whereClause,
        include: {
          account: true,
          rep: true,
          source: true
        },
        orderBy: { created_at: 'desc' }
      })

      // For now, skip analytics lookup and use computed values from probability
      // TODO: Fix JSON queries for analytics
      const predictionMap = new Map<number, number>()
      const healthMap = new Map<number, string>()

      // Map to interface format
      return opportunities.map(opp => ({
        id: opp.id.toString(),
        name: opp.title || 'Untitled Opportunity',
        owner: opp.rep.name,
        ownerRole: opp.rep.title || 'Sales Rep',
        region: opp.rep.region || 'Unknown',
        createdDate: formatDateString(opp.created_at),
        closeDate: formatDateString(opp.close_date),
        stage: opp.stage,
        accountName: opp.account.name,
        amount: opp.amount,
        source: opp.source?.name || 'Unknown',
        age: calculateAge(opp.created_at),
        fiscalPeriod: determineFiscalPeriod(opp.close_date),
        predictionScore: predictionMap.get(opp.id) || Math.round(opp.probability * 100),
        healthScore: (healthMap.get(opp.id) as "high" | "medium" | "low") || this.inferHealthScore(opp.probability)
      }))
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      throw new Error('Failed to fetch opportunities from database')
    }
  }

  async getOpportunityById(rawId: string): Promise<OpportunityRecord | null> {
    try {
      const id = parseInt(rawId)
      if (isNaN(id)) {
        console.warn("getOpportunityById received non-numeric ID:", rawId)
        return null
      }

      const opportunity = await prisma.opportunity.findFirst({
        where: { id },
        include: {
          account: true,
          rep: true,
          source: true,
        },
      })

      if (!opportunity) {
        return null
      }

      // For now, use computed values from probability
      // TODO: Fix analytics JSON queries
      const predictionScore = Math.round(opportunity.probability * 100)
      const healthScore: "high" | "medium" | "low" = this.inferHealthScore(opportunity.probability)

      return {
        id: opportunity.id.toString(),
        name: opportunity.title || "Untitled Opportunity",
        owner: opportunity.rep.name,
        ownerRole: opportunity.rep.title || "Sales Rep",
        region: opportunity.rep.region || "Unknown",
        createdDate: formatDateString(opportunity.created_at),
        closeDate: formatDateString(opportunity.close_date),
        stage: opportunity.stage,
        accountName: opportunity.account.name,
        amount: opportunity.amount,
        source: opportunity.source?.name || "Unknown",
        age: calculateAge(opportunity.created_at),
        fiscalPeriod: determineFiscalPeriod(opportunity.close_date),
        predictionScore,
        healthScore,
      }
    } catch (error) {
      console.error("Error fetching opportunity by ID:", error)
      return null
    }
  }

  async createOpportunity(data: Omit<OpportunityRecord, "id" | "age">): Promise<OpportunityRecord> {
    try {
      // Find or create related entities
      const rep = await prisma.rep.findFirst({
        where: { name: data.owner },
      })

      if (!rep) {
        throw new Error(`Rep ${data.owner} not found`)
      }

      const account = await prisma.account.upsert({
        where: { name: data.accountName },
        create: {
          org_id: `ORG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          name: data.accountName,
        },
        update: {},
      })

      const source = data.source
        ? await prisma.source.upsert({
            where: { name: data.source },
            create: {
              name: data.source,
              type: "inbound",
              category: "digital",
            },
            update: {},
          })
        : null

      const pipeline = await prisma.pipeline.findFirst({
        where: { name: "Default Pipeline" },
      })

      // Create opportunity
      const opportunity = await prisma.opportunity.create({
        data: {
          externalId: `006Rj${String(Math.floor(Math.random() * 10000000000))
            .padStart(10, "0")}`,
          title: data.name,
          product_category: "Sales",
          amount: data.amount,
          stage: data.stage,
          probability: data.predictionScore / 100,
          priority: "medium",
          close_date: new Date(data.closeDate),
          created_at: new Date(data.createdDate),
          account: { connect: { id: account.id } },
          rep: { connect: { id: rep.id } },
          source: source ? { connect: { id: source.id } } : undefined,
          pipeline: pipeline ? { connect: { id: pipeline.id } } : undefined,
        },
        include: {
          account: true,
          rep: true,
          source: true,
        },
      })

      // Create analytics entries
      await prisma.analytics.create({
        data: {
          metric: "prediction_score",
          value: data.predictionScore,
          period: data.fiscalPeriod,
          period_start: new Date(),
          period_end: new Date(),
          metadata_json: { opportunity_id: opportunity.id },
          rep_id: rep.id,
          source_id: source?.id,
          pipeline_id: pipeline?.id,
        },
      })

      const healthValue = data.healthScore === "high" ? 3 : data.healthScore === "medium" ? 2 : 1
      await prisma.analytics.create({
        data: {
          metric: "health_score",
          value: healthValue,
          period: data.fiscalPeriod,
          period_start: new Date(),
          period_end: new Date(),
          metadata_json: { opportunity_id: opportunity.id },
          rep_id: rep.id,
          source_id: source?.id,
          pipeline_id: pipeline?.id,
        },
      })

      return {
        id: opportunity.id.toString(),
        name: opportunity.title || "Untitled",
        owner: opportunity.rep.name,
        ownerRole: opportunity.rep.title || "Sales Rep",
        region: opportunity.rep.region || "Unknown",
        createdDate: formatDateString(opportunity.created_at),
        closeDate: formatDateString(opportunity.close_date),
        stage: opportunity.stage,
        accountName: opportunity.account.name,
        amount: opportunity.amount,
        source: opportunity.source?.name || "Unknown",
        age: calculateAge(opportunity.created_at),
        fiscalPeriod: determineFiscalPeriod(opportunity.close_date),
        predictionScore: data.predictionScore,
        healthScore: data.healthScore,
      }
    } catch (error) {
      console.error("Error creating opportunity:", error)
      throw new Error("Failed to create opportunity")
    }
  }

  async updateOpportunity(
    id: string,
    data: Partial<Omit<OpportunityRecord, "id">>
  ): Promise<OpportunityRecord> {
    try {
      const opportunityId = parseInt(id)
       if (isNaN(opportunityId)) {
        throw new Error("Invalid opportunity ID")
      }

      const updateData: any = {}
      if (data.name) updateData.title = data.name
      if (data.amount !== undefined) updateData.amount = data.amount
      if (data.stage) updateData.stage = data.stage
      if (data.closeDate) updateData.close_date = new Date(data.closeDate)
      if (data.predictionScore !== undefined)
        updateData.probability = data.predictionScore / 100

      await prisma.opportunity.update({
        where: { id: opportunityId },
        data: updateData,
        include: {
          account: true,
          rep: true,
          source: true,
        },
      })

      // Update analytics if provided
      if (data.predictionScore !== undefined) {
        await prisma.analytics.upsert({
          where: {
            id: (await this.findAnalyticsId(opportunityId, "prediction_score")) || 0,
          },
          create: {
            metric: "prediction_score",
            value: data.predictionScore,
            period: "updated",
            period_start: new Date(),
            period_end: new Date(),
            metadata_json: { opportunity_id: opportunityId },
          },
          update: {
            value: data.predictionScore,
            updated_at: new Date(),
          },
        })
      }

      if (data.healthScore) {
        const healthValue = data.healthScore === "high" ? 3 : data.healthScore === "medium" ? 2 : 1
        await prisma.analytics.upsert({
          where: {
            id: (await this.findAnalyticsId(opportunityId, "health_score")) || 0,
          },
          create: {
            metric: "health_score",
            value: healthValue,
            period: "updated",
            period_start: new Date(),
            period_end: new Date(),
            metadata_json: { opportunity_id: opportunityId },
          },
          update: {
            value: healthValue,
            updated_at: new Date(),
          },
        })
      }

      // Return updated opportunity
      const updated = await this.getOpportunityById(id)
      if (!updated) {
        throw new Error("Failed to retrieve updated opportunity")
      }
      return updated
    } catch (error) {
      console.error("Error updating opportunity:", error)
      throw new Error("Failed to update opportunity")
    }
  }

  async deleteOpportunity(id: string): Promise<void> {
    try {
      const opportunityId = parseInt(id)
      if (isNaN(opportunityId)) {
        throw new Error("Invalid opportunity ID")
      }
      
      // Delete related analytics
      await prisma.analytics.deleteMany({
        where: {
          metadata_json: {
            path: ["opportunity_id"],
            equals: opportunityId,
          },
        },
      })

      // Delete opportunity
      await prisma.opportunity.delete({
        where: { id: opportunityId },
      })
    } catch (error) {
      console.error("Error deleting opportunity:", error)
      throw new Error("Failed to delete opportunity")
    }
  }

  private inferHealthScore(probability: number): "high" | "medium" | "low" {
    if (probability >= 0.7) return "high"
    if (probability >= 0.4) return "medium"
    return "low"
  }

  private async findAnalyticsId(oppId: number, metric: string): Promise<number | null> {
    const analytic = await prisma.analytics.findFirst({
      where: {
        metric,
        metadata_json: {
          path: ['opportunity_id'],
          equals: oppId
        }
      }
    })
    return analytic?.id || null
  }
}

class PostgresRepMetricsDAL implements IRepMetricsDAL {
  async getAllRepMetrics(): Promise<RepMetricsRecord[]> {
    try {
      const reps = await prisma.rep.findMany({
        where: { is_active: true }
      })

      // Get analytics for each rep
      const repMetrics = await Promise.all(reps.map(async (rep) => {
        const analytics = await prisma.analytics.findMany({
          where: { rep_id: rep.id }
        })

        // Create metrics lookup
        const metrics: any = {}
        analytics.forEach(analytic => {
          metrics[analytic.metric] = analytic.value
        })

        // Always calculate opportunities from actual Opportunity table
        const repOpportunities = await prisma.opportunity.count({
          where: { owner_id: rep.id }
        })
        metrics.opportunities = repOpportunities

        return {
          name: rep.name,
          email: rep.email,
          role: rep.title || 'Sales Rep',
          region: rep.region || 'Unknown',
          totalCalls: metrics.total_calls || 0,
          callsPerWeek: metrics.calls_per_week || 0,
          timeOnCalls: metrics.time_on_calls || 0,
          avgCallDuration: metrics.avg_call_duration || 0,
          opportunities: metrics.opportunities || 0,
          pipelineValue: metrics.pipeline_value || 0,
          closedWon: metrics.closed_won || 0,
          winRate: metrics.win_rate || 0,
          avgDealSize: metrics.avg_deal_size || 0,
          quota: rep.quota || metrics.quota || 0,
          quotaAttainment: metrics.quota_attainment || 0
        }
      }))

      return repMetrics
    } catch (error) {
      console.error('Error fetching rep metrics:', error)
      throw new Error('Failed to fetch rep metrics from database')
    }
  }

  async getRepMetricsByName(name: string): Promise<RepMetricsRecord | null> {
    try {
      const allReps = await this.getAllRepMetrics()
      return allReps.find(rep => rep.name === name) || null
    } catch (error) {
      console.error('Error fetching rep by name:', error)
      return null
    }
  }

  async updateRepMetrics(name: string, data: Partial<RepMetricsRecord>): Promise<RepMetricsRecord> {
    try {
      const rep = await prisma.rep.findFirst({
        where: { name }
      })

      if (!rep) {
        throw new Error(`Rep ${name} not found`)
      }

      // Update rep record
      if (data.email || data.role || data.region || data.quota !== undefined) {
        await prisma.rep.update({
          where: { id: rep.id },
          data: {
            email: data.email,
            title: data.role,
            region: data.region,
            quota: data.quota
          }
        })
      }

      // Update analytics
      const metricsToUpdate = [
        ['total_calls', data.totalCalls],
        ['calls_per_week', data.callsPerWeek],
        ['time_on_calls', data.timeOnCalls],
        ['avg_call_duration', data.avgCallDuration],
        ['opportunities', data.opportunities],
        ['pipeline_value', data.pipelineValue],
        ['closed_won', data.closedWon],
        ['win_rate', data.winRate],
        ['avg_deal_size', data.avgDealSize],
        ['quota_attainment', data.quotaAttainment]
      ]

      for (const [metric, value] of metricsToUpdate) {
        if (value !== undefined) {
          await prisma.analytics.upsert({
            where: {
              id: await this.findRepAnalyticsId(rep.id, metric as string) || 0
            },
            create: {
              metric: metric as string,
              value: value as number,
              period: 'updated',
              period_start: new Date(),
              period_end: new Date(),
              rep_id: rep.id
            },
            update: {
              value: value as number,
              updated_at: new Date()
            }
          })
        }
      }

      // Return updated metrics
      const updated = await this.getRepMetricsByName(name)
      if (!updated) {
        throw new Error('Failed to retrieve updated rep metrics')
      }
      return updated
    } catch (error) {
      console.error('Error updating rep metrics:', error)
      throw new Error('Failed to update rep metrics')
    }
  }

  private async findRepAnalyticsId(repId: string, metric: string): Promise<number | null> {
    const analytic = await prisma.analytics.findFirst({
      where: {
        rep_id: repId,
        metric
      }
    })
    return analytic?.id || null
  }
}

class PostgresConfigDAL implements IConfigDAL {
  async getStages(): Promise<string[]> {
    try {
      const pipeline = await prisma.pipeline.findFirst({
        where: { name: 'Default Pipeline' }
      })

      if (pipeline?.stage_order && Array.isArray(pipeline.stage_order)) {
        return pipeline.stage_order as string[]
      }

      // Fallback stages
      return [
        "Qualification (SAL)",
        "Discovery (SAO)",
        "Consensus / Demo",
        "Proof of Value",
        "Business Negotiation",
        "Legal Review",
        "Closed Won",
        "Closed Lost"
      ]
    } catch (error) {
      console.error('Error fetching stages:', error)
      throw new Error('Failed to fetch pipeline stages')
    }
  }

  async updateStages(newStages: string[]): Promise<string[]> {
    try {
      const pipeline = await prisma.pipeline.upsert({
        where: { name: 'Default Pipeline' },
        create: {
          name: 'Default Pipeline',
          description: 'Default pipeline stages',
          stage_order: newStages
        },
        update: {
          stage_order: newStages
        }
      })

      return Array.isArray(pipeline.stage_order) 
        ? pipeline.stage_order as string[]
        : newStages
    } catch (error) {
      console.error('Error updating stages:', error)
      throw new Error('Failed to update pipeline stages')
    }
  }
}

class PostgresDAL implements IDAL {
  opportunities: IOpportunityDAL
  repMetrics: IRepMetricsDAL
  config: IConfigDAL

  constructor() {
    this.opportunities = new PostgresOpportunityDAL()
    this.repMetrics = new PostgresRepMetricsDAL()
    this.config = new PostgresConfigDAL()
  }

  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }

  async disconnect(): Promise<void> {
    await prisma.$disconnect()
  }
}

// Export singleton instance
export const postgresDAL = new PostgresDAL()