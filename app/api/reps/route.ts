// app/api/reps/route.ts
import { NextResponse } from 'next/server'
import { getDirectDAL } from '@/lib/api-client'

export async function GET() {
  try {
    const dal = getDirectDAL()
    const repMetrics = await dal.repMetrics.getAllRepMetrics()
    
    return NextResponse.json({ success: true, data: repMetrics })
  } catch (error) {
    console.error('API Error - GET /api/reps:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rep metrics' },
      { status: 500 }
    )
  }
}