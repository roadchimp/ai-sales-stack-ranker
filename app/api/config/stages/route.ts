// app/api/config/stages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDirectDAL } from '@/lib/api-client'

export async function GET() {
  try {
    const dal = getDirectDAL()
    const stages = await dal.config.getStages()
    
    return NextResponse.json({ success: true, data: stages })
  } catch (error) {
    console.error('API Error - GET /api/config/stages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stages' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dal = getDirectDAL()
    const { stages } = await request.json()
    
    const updatedStages = await dal.config.updateStages(stages)
    
    return NextResponse.json({ success: true, data: updatedStages })
  } catch (error) {
    console.error('API Error - PUT /api/config/stages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update stages' },
      { status: 500 }
    )
  }
}