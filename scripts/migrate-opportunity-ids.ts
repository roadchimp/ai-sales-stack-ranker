// scripts/migrate-opportunity-ids.ts
import { PrismaClient } from '@prisma/client'
import { postgresDAL } from '../server/dal/postgres'

const prisma = new PrismaClient()

async function migrateOpportunityIds() {
  console.log('Starting opportunity ID migration...')
  
  // Get all opportunities
  const existingOpps = await prisma.opportunity.findMany()
  
  for (const opp of existingOpps) {
    if (!opp.externalId) {
      // Generate Salesforce-style ID
      const salesforceId = `006Rj${String(opp.id).padStart(10, '0')}`
      
      // Update the opportunity with new ID format
      await prisma.opportunity.update({
        where: { id: opp.id },
        data: { externalId: salesforceId },
      })
      
      console.log(`Migrated opportunity ${opp.id} -> ${salesforceId}`)
    }
  }
  
  console.log('ID migration complete!')
}

migrateOpportunityIds()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
