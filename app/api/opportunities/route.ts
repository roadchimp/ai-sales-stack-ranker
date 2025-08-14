// app/api/opportunities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDirectDAL } from '@/lib/api-client'

export async function GET(request: NextRequest) {
  try {
    const dal = getDirectDAL()
    
    // Parse query parameters for filters
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage')
    const rep = searchParams.get('rep') 
    const region = searchParams.get('region')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filters: any = {}
    if (stage) filters.stage = stage
    if (rep) filters.rep = rep
    if (region) filters.region = region
    if (startDate && endDate) {
      filters.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      }
    }

    const opportunities = await dal.opportunities.getAllOpportunities(filters)
    
    return NextResponse.json({ success: true, data: opportunities })
  } catch (error) {
    console.error('API Error - GET /api/opportunities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const dal = getDirectDAL()
    const body = await request.json()
    
    const opportunity = await dal.opportunities.createOpportunity(body)
    
    return NextResponse.json({ success: true, data: opportunity }, { status: 201 })
  } catch (error) {
    console.error('API Error - POST /api/opportunities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create opportunity' },
      { status: 500 }
    )
  }
}