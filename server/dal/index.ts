// src/server/dal/index.ts
// DAL interfaces & factory for AI Sales Stack Ranker

export interface OpportunityRecord {
  id: string
  name: string
  owner: string
  ownerRole: string
  region: string
  createdDate: string
  closeDate: string
  stage: string
  accountName: string
  amount: number
  source: string
  age: number
  fiscalPeriod: string
  predictionScore: number
  healthScore: "high" | "medium" | "low"
}

export interface RepMetricsRecord {
  name: string
  email: string
  role: string
  region: string
  totalCalls: number
  callsPerWeek: number
  timeOnCalls: number
  avgCallDuration: number
  opportunities: number
  pipelineValue: number
  closedWon: number
  winRate: number
  avgDealSize: number
  quota: number
  quotaAttainment: number
}

export interface OpportunityFilters {
  stage?: string
  rep?: string
  region?: string
  dateRange?: { start: Date; end: Date }
}

export interface IOpportunityDAL {
  getAllOpportunities(filters?: OpportunityFilters): Promise<OpportunityRecord[]>
  getOpportunityById(id: string): Promise<OpportunityRecord | null>
  createOpportunity(data: Omit<OpportunityRecord, 'id' | 'age'>): Promise<OpportunityRecord>
  updateOpportunity(id: string, data: Partial<Omit<OpportunityRecord, 'id'>>): Promise<OpportunityRecord>
  deleteOpportunity(id: string): Promise<void>
}

export interface IRepMetricsDAL {
  getAllRepMetrics(): Promise<RepMetricsRecord[]>
  getRepMetricsByName(name: string): Promise<RepMetricsRecord | null>
  updateRepMetrics(name: string, data: Partial<RepMetricsRecord>): Promise<RepMetricsRecord>
}

export interface IConfigDAL {
  getStages(): Promise<string[]>
  updateStages(stages: string[]): Promise<string[]>
}

export interface IDAL {
  opportunities: IOpportunityDAL
  repMetrics: IRepMetricsDAL
  config: IConfigDAL
  healthCheck(): Promise<boolean>
  disconnect(): Promise<void>
}

// Factory picks implementation based on env
export function createDAL(): IDAL {
  const useInMemory = process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV === 'test'
  
  if (useInMemory) {
    const { inMemoryDAL } = require('./in-memory')
    return inMemoryDAL
  }
  
  const { postgresDAL } = require('./postgres')
  return postgresDAL
}

// Singleton instance
let dalInstance: IDAL | null = null

export function getDAL(): IDAL {
  if (!dalInstance) {
    dalInstance = createDAL()
  }
  return dalInstance
}

// Helper for graceful shutdown
export async function closeDAL(): Promise<void> {
  if (dalInstance) {
    await dalInstance.disconnect()
    dalInstance = null
  }
}