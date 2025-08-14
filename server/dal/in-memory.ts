// src/server/dal/in-memory.ts
// In-memory DAL implementation using existing sample data

import { 
  sampleOpportunities, 
  sampleRepMetrics, 
  stages,
  type Opportunity,
  type RepMetrics 
} from '../../lib/sample-data'

import { 
  IDAL, 
  IOpportunityDAL, 
  IRepMetricsDAL, 
  IConfigDAL,
  OpportunityRecord, 
  RepMetricsRecord, 
  OpportunityFilters 
} from './index'

// In-memory storage - cloned from static data
let opportunities: OpportunityRecord[] = [...sampleOpportunities]
let repMetrics: RepMetricsRecord[] = [...sampleRepMetrics]
let pipelineStages: string[] = [...stages]

class InMemoryOpportunityDAL implements IOpportunityDAL {
  async getAllOpportunities(filters?: OpportunityFilters): Promise<OpportunityRecord[]> {
    let filtered = [...opportunities]

    if (filters?.stage) {
      filtered = filtered.filter(opp => opp.stage === filters.stage)
    }

    if (filters?.rep) {
      filtered = filtered.filter(opp => opp.owner === filters.rep)
    }

    if (filters?.region) {
      filtered = filtered.filter(opp => opp.region === filters.region)
    }

    if (filters?.dateRange) {
      filtered = filtered.filter(opp => {
        const oppDate = new Date(opp.createdDate)
        return oppDate >= filters.dateRange!.start && oppDate <= filters.dateRange!.end
      })
    }

    return filtered
  }

  async getOpportunityById(id: string): Promise<OpportunityRecord | null> {
    const opportunity = opportunities.find(opp => opp.id === id)
    return opportunity || null
  }

  async createOpportunity(data: Omit<OpportunityRecord, 'id' | 'age'>): Promise<OpportunityRecord> {
    const newOpportunity: OpportunityRecord = {
      ...data,
      id: `OPP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      age: this.calculateAge(new Date(data.createdDate))
    }

    opportunities.push(newOpportunity)
    return newOpportunity
  }

  async updateOpportunity(id: string, data: Partial<Omit<OpportunityRecord, 'id'>>): Promise<OpportunityRecord> {
    const index = opportunities.findIndex(opp => opp.id === id)
    if (index === -1) {
      throw new Error(`Opportunity with id ${id} not found`)
    }

    const updatedOpportunity = {
      ...opportunities[index],
      ...data,
      // Recalculate age if createdDate changes
      age: data.createdDate 
        ? this.calculateAge(new Date(data.createdDate))
        : opportunities[index].age
    }

    opportunities[index] = updatedOpportunity
    return updatedOpportunity
  }

  async deleteOpportunity(id: string): Promise<void> {
    const index = opportunities.findIndex(opp => opp.id === id)
    if (index === -1) {
      throw new Error(`Opportunity with id ${id} not found`)
    }

    opportunities.splice(index, 1)
  }

  private calculateAge(createdDate: Date): number {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

class InMemoryRepMetricsDAL implements IRepMetricsDAL {
  async getAllRepMetrics(): Promise<RepMetricsRecord[]> {
    return [...repMetrics]
  }

  async getRepMetricsByName(name: string): Promise<RepMetricsRecord | null> {
    const rep = repMetrics.find(rep => rep.name === name)
    return rep || null
  }

  async updateRepMetrics(name: string, data: Partial<RepMetricsRecord>): Promise<RepMetricsRecord> {
    const index = repMetrics.findIndex(rep => rep.name === name)
    if (index === -1) {
      throw new Error(`Rep with name ${name} not found`)
    }

    const updatedRep = {
      ...repMetrics[index],
      ...data
    }

    repMetrics[index] = updatedRep
    return updatedRep
  }
}

class InMemoryConfigDAL implements IConfigDAL {
  async getStages(): Promise<string[]> {
    return [...pipelineStages]
  }

  async updateStages(newStages: string[]): Promise<string[]> {
    pipelineStages = [...newStages]
    return pipelineStages
  }
}

class InMemoryDAL implements IDAL {
  opportunities: IOpportunityDAL
  repMetrics: IRepMetricsDAL
  config: IConfigDAL

  constructor() {
    this.opportunities = new InMemoryOpportunityDAL()
    this.repMetrics = new InMemoryRepMetricsDAL()
    this.config = new InMemoryConfigDAL()
  }

  async healthCheck(): Promise<boolean> {
    // Always healthy for in-memory implementation
    return true
  }

  async disconnect(): Promise<void> {
    // Nothing to disconnect for in-memory implementation
    return Promise.resolve()
  }
}

// Export singleton instance
export const inMemoryDAL = new InMemoryDAL()

// Helper function to reset data (useful for testing)
export function resetInMemoryData(): void {
  opportunities = [...sampleOpportunities]
  repMetrics = [...sampleRepMetrics]
  pipelineStages = [...stages]
}