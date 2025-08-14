// lib/api-client.ts
// UI-facing API wrappers (maintains backward compatibility)

import type { OpportunityRecord, RepMetricsRecord, OpportunityFilters } from '../server/dal'

// Re-export types for UI components
export type { OpportunityRecord as Opportunity, RepMetricsRecord as RepMetrics }

// Backward compatibility aliases
export type { OpportunityRecord, RepMetricsRecord, OpportunityFilters }

class ApiClient {
  private baseUrl = ''

  // Helper method for HTTP requests
  private async fetchApi<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data
  }

  // Opportunity methods
  async getOpportunities(filters?: OpportunityFilters): Promise<OpportunityRecord[]> {
    try {
      const queryParams = new URLSearchParams()
      if (filters?.stage) queryParams.set('stage', filters.stage)
      if (filters?.rep) queryParams.set('rep', filters.rep)
      if (filters?.region) queryParams.set('region', filters.region)
      if (filters?.dateRange?.start) queryParams.set('startDate', filters.dateRange.start.toISOString())
      if (filters?.dateRange?.end) queryParams.set('endDate', filters.dateRange.end.toISOString())
      
      const endpoint = `/opportunities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      return await this.fetchApi<OpportunityRecord[]>(endpoint)
    } catch (error) {
      console.error('API Client - Error fetching opportunities:', error)
      throw error
    }
  }

  async getOpportunity(id: string): Promise<OpportunityRecord | null> {
    try {
      return await this.fetchApi<OpportunityRecord>(`/opportunities/${id}`)
    } catch (error) {
      console.error('API Client - Error fetching opportunity:', error)
      return null
    }
  }

  async createOpportunity(data: Omit<OpportunityRecord, 'id' | 'age'>): Promise<OpportunityRecord> {
    try {
      return await this.fetchApi<OpportunityRecord>('/opportunities', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('API Client - Error creating opportunity:', error)
      throw error
    }
  }

  async updateOpportunity(id: string, data: Partial<Omit<OpportunityRecord, 'id'>>): Promise<OpportunityRecord> {
    try {
      return await this.fetchApi<OpportunityRecord>(`/opportunities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('API Client - Error updating opportunity:', error)
      throw error
    }
  }

  async deleteOpportunity(id: string): Promise<void> {
    try {
      await this.fetchApi<void>(`/opportunities/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('API Client - Error deleting opportunity:', error)
      throw error
    }
  }

  // Rep metrics methods
  async getRepMetrics(): Promise<RepMetricsRecord[]> {
    try {
      return await this.fetchApi<RepMetricsRecord[]>('/reps')
    } catch (error) {
      console.error('API Client - Error fetching rep metrics:', error)
      throw error
    }
  }

  async getRepMetric(name: string): Promise<RepMetricsRecord | null> {
    try {
      const allReps = await this.getRepMetrics()
      return allReps.find(rep => rep.name === name) || null
    } catch (error) {
      console.error('API Client - Error fetching rep metric:', error)
      return null
    }
  }

  async updateRepMetric(name: string, data: Partial<RepMetricsRecord>): Promise<RepMetricsRecord> {
    try {
      return await this.fetchApi<RepMetricsRecord>(`/reps/${encodeURIComponent(name)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('API Client - Error updating rep metric:', error)
      throw error
    }
  }

  // Config methods
  async getStages(): Promise<string[]> {
    try {
      return await this.fetchApi<string[]>('/config/stages')
    } catch (error) {
      console.error('API Client - Error fetching stages:', error)
      // Return fallback stages
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
    }
  }

  async updateStages(stages: string[]): Promise<string[]> {
    try {
      return await this.fetchApi<string[]>('/config/stages', {
        method: 'PUT',
        body: JSON.stringify({ stages }),
      })
    } catch (error) {
      console.error('API Client - Error updating stages:', error)
      throw error
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.fetchApi<void>('/health')
      return true
    } catch (error) {
      console.error('API Client - Health check failed:', error)
      return false
    }
  }
}

// Singleton instance
const apiClient = new ApiClient()

// Convenience functions that match existing static data usage patterns
export async function getOpportunities(filters?: OpportunityFilters): Promise<OpportunityRecord[]> {
  return apiClient.getOpportunities(filters)
}

export async function getOpportunity(id: string): Promise<OpportunityRecord | null> {
  return apiClient.getOpportunity(id)
}

export async function getRepMetrics(): Promise<RepMetricsRecord[]> {
  return apiClient.getRepMetrics()
}

export async function getStages(): Promise<string[]> {
  return apiClient.getStages()
}

// Export the client for more advanced usage
export { apiClient }

// Default export for easy importing
export default apiClient

// Helper to check if we're using database vs in-memory
export function isDatabaseMode(): boolean {
  return process.env.USE_IN_MEMORY !== 'true' && process.env.NODE_ENV !== 'test'
}

// Utility for server-side components that need direct DAL access
export function getDirectDAL() {
  // Only import DAL on server side
  if (typeof window === 'undefined') {
    const { getDAL } = require('../server/dal')
    return getDAL()
  }
  throw new Error('getDirectDAL can only be called on the server side')
}