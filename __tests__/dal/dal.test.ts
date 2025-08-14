// __tests__/dal/dal.test.ts
// Unit tests for DAL implementations

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { getDAL, IDAL, OpportunityRecord, RepMetricsRecord } from '../../server/dal'
import { resetInMemoryData } from '../../server/dal/in-memory'

// Force in-memory mode for testing
process.env.USE_IN_MEMORY = 'true'

describe('DAL Implementation Tests', () => {
  let dal: IDAL

  beforeEach(async () => {
    // Reset in-memory data before each test
    resetInMemoryData()
    dal = getDAL()
  })

  afterEach(async () => {
    await dal.disconnect()
  })

  describe('Health Check', () => {
    it('should pass health check', async () => {
      const isHealthy = await dal.healthCheck()
      expect(isHealthy).toBe(true)
    })
  })

  describe('Opportunities', () => {
    it('should get all opportunities', async () => {
      const opportunities = await dal.opportunities.getAllOpportunities()
      
      expect(Array.isArray(opportunities)).toBe(true)
      expect(opportunities.length).toBeGreaterThan(0)
      
      // Check structure of first opportunity
      if (opportunities.length > 0) {
        const opp = opportunities[0]
        expect(opp).toHaveProperty('id')
        expect(opp).toHaveProperty('name')
        expect(opp).toHaveProperty('owner')
        expect(opp).toHaveProperty('stage')
        expect(opp).toHaveProperty('amount')
        expect(typeof opp.amount).toBe('number')
      }
    })

    it('should filter opportunities by stage', async () => {
      const allOpportunities = await dal.opportunities.getAllOpportunities()
      const firstStage = allOpportunities[0]?.stage
      
      if (firstStage) {
        const filtered = await dal.opportunities.getAllOpportunities({
          stage: firstStage
        })
        
        expect(filtered.length).toBeGreaterThan(0)
        expect(filtered.every(opp => opp.stage === firstStage)).toBe(true)
      }
    })

    it('should filter opportunities by rep', async () => {
      const allOpportunities = await dal.opportunities.getAllOpportunities()
      const firstRep = allOpportunities[0]?.owner
      
      if (firstRep) {
        const filtered = await dal.opportunities.getAllOpportunities({
          rep: firstRep
        })
        
        expect(filtered.length).toBeGreaterThan(0)
        expect(filtered.every(opp => opp.owner === firstRep)).toBe(true)
      }
    })

    it('should get opportunity by ID', async () => {
      const allOpportunities = await dal.opportunities.getAllOpportunities()
      const firstOpp = allOpportunities[0]
      
      if (firstOpp) {
        const retrieved = await dal.opportunities.getOpportunityById(firstOpp.id)
        expect(retrieved).toBeTruthy()
        expect(retrieved?.id).toBe(firstOpp.id)
        expect(retrieved?.name).toBe(firstOpp.name)
      }
    })

    it('should return null for non-existent opportunity', async () => {
      const nonExistentId = 'non-existent-id-12345'
      const retrieved = await dal.opportunities.getOpportunityById(nonExistentId)
      expect(retrieved).toBeNull()
    })

    it('should create new opportunity', async () => {
      const newOpp: Omit<OpportunityRecord, 'id' | 'age'> = {
        name: 'Test Opportunity',
        owner: 'Christopher Tucker', // Use existing rep from sample data
        ownerRole: 'Sales Manager',
        region: 'SouthEast',
        createdDate: '2024-01-01',
        closeDate: '2024-06-01',
        stage: 'Discovery (SAO)',
        accountName: 'Test Account',
        amount: 50000,
        source: 'Test Source',
        fiscalPeriod: 'Q2-2024',
        predictionScore: 75,
        healthScore: 'high'
      }

      const created = await dal.opportunities.createOpportunity(newOpp)
      
      expect(created.id).toBeTruthy()
      expect(created.name).toBe(newOpp.name)
      expect(created.owner).toBe(newOpp.owner)
      expect(created.amount).toBe(newOpp.amount)
      expect(created.age).toBeGreaterThan(0)
    })

    it('should update existing opportunity', async () => {
      const opportunities = await dal.opportunities.getAllOpportunities()
      const firstOpp = opportunities[0]
      
      if (firstOpp) {
        const updateData = {
          name: 'Updated Opportunity Name',
          amount: 99999,
          stage: 'Legal Review'
        }

        const updated = await dal.opportunities.updateOpportunity(firstOpp.id, updateData)
        
        expect(updated.id).toBe(firstOpp.id)
        expect(updated.name).toBe(updateData.name)
        expect(updated.amount).toBe(updateData.amount)
        expect(updated.stage).toBe(updateData.stage)
      }
    })

    it('should delete opportunity', async () => {
      // Create a test opportunity first
      const newOpp: Omit<OpportunityRecord, 'id' | 'age'> = {
        name: 'Opportunity to Delete',
        owner: 'Christopher Tucker',
        ownerRole: 'Sales Manager',
        region: 'SouthEast',
        createdDate: '2024-01-01',
        closeDate: '2024-06-01',
        stage: 'Discovery (SAO)',
        accountName: 'Test Account',
        amount: 25000,
        source: 'Test Source',
        fiscalPeriod: 'Q2-2024',
        predictionScore: 50,
        healthScore: 'medium'
      }

      const created = await dal.opportunities.createOpportunity(newOpp)
      
      // Verify it exists
      let retrieved = await dal.opportunities.getOpportunityById(created.id)
      expect(retrieved).toBeTruthy()
      
      // Delete it
      await dal.opportunities.deleteOpportunity(created.id)
      
      // Verify it's gone
      retrieved = await dal.opportunities.getOpportunityById(created.id)
      expect(retrieved).toBeNull()
    })
  })

  describe('Rep Metrics', () => {
    it('should get all rep metrics', async () => {
      const repMetrics = await dal.repMetrics.getAllRepMetrics()
      
      expect(Array.isArray(repMetrics)).toBe(true)
      expect(repMetrics.length).toBeGreaterThan(0)
      
      // Check structure of first rep
      if (repMetrics.length > 0) {
        const rep = repMetrics[0]
        expect(rep).toHaveProperty('name')
        expect(rep).toHaveProperty('email')
        expect(rep).toHaveProperty('role')
        expect(rep).toHaveProperty('quota')
        expect(typeof rep.quota).toBe('number')
      }
    })

    it('should get rep metrics by name', async () => {
      const allReps = await dal.repMetrics.getAllRepMetrics()
      const firstRep = allReps[0]
      
      if (firstRep) {
        const retrieved = await dal.repMetrics.getRepMetricsByName(firstRep.name)
        expect(retrieved).toBeTruthy()
        expect(retrieved?.name).toBe(firstRep.name)
        expect(retrieved?.email).toBe(firstRep.email)
      }
    })

    it('should return null for non-existent rep', async () => {
      const nonExistentName = 'Non Existent Rep'
      const retrieved = await dal.repMetrics.getRepMetricsByName(nonExistentName)
      expect(retrieved).toBeNull()
    })

    it('should update rep metrics', async () => {
      const allReps = await dal.repMetrics.getAllRepMetrics()
      const firstRep = allReps[0]
      
      if (firstRep) {
        const updateData = {
          quota: 999999,
          quotaAttainment: 150,
          totalCalls: 500
        }

        const updated = await dal.repMetrics.updateRepMetrics(firstRep.name, updateData)
        
        expect(updated.name).toBe(firstRep.name)
        expect(updated.quota).toBe(updateData.quota)
        expect(updated.quotaAttainment).toBe(updateData.quotaAttainment)
        expect(updated.totalCalls).toBe(updateData.totalCalls)
      }
    })
  })

  describe('Config', () => {
    it('should get pipeline stages', async () => {
      const stages = await dal.config.getStages()
      
      expect(Array.isArray(stages)).toBe(true)
      expect(stages.length).toBeGreaterThan(0)
      expect(stages).toContain('Discovery (SAO)')
      expect(stages).toContain('Business Negotiation')
    })

    it('should update pipeline stages', async () => {
      const newStages = [
        'New Stage 1',
        'New Stage 2', 
        'New Stage 3',
        'Closed Won',
        'Closed Lost'
      ]

      const updated = await dal.config.updateStages(newStages)
      
      expect(updated).toEqual(newStages)
      
      // Verify the update persisted
      const retrieved = await dal.config.getStages()
      expect(retrieved).toEqual(newStages)
    })
  })

  describe('Error Handling', () => {
    it('should handle non-existent opportunity update gracefully', async () => {
      const nonExistentId = 'non-existent-id-12345'
      
      await expect(
        dal.opportunities.updateOpportunity(nonExistentId, { name: 'Updated Name' })
      ).rejects.toThrow()
    })

    it('should handle non-existent opportunity deletion gracefully', async () => {
      const nonExistentId = 'non-existent-id-12345'
      
      await expect(
        dal.opportunities.deleteOpportunity(nonExistentId)
      ).rejects.toThrow()
    })

    it('should handle non-existent rep update gracefully', async () => {
      const nonExistentName = 'Non Existent Rep'
      
      await expect(
        dal.repMetrics.updateRepMetrics(nonExistentName, { quota: 100000 })
      ).rejects.toThrow()
    })
  })
})