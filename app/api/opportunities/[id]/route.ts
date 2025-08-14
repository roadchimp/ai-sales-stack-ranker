// app/api/opportunities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDirectDAL } from '@/lib/api-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dal = getDirectDAL()
    const opportunity = await dal.opportunities.getOpportunityById(params.id)
    
    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: opportunity })
  } catch (error) {
    console.error(`API Error - GET /api/opportunities/${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunity' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dal = getDirectDAL()
    const body = await request.json()
    
    const opportunity = await dal.opportunities.updateOpportunity(params.id, body)
    
    return NextResponse.json({ success: true, data: opportunity })
  } catch (error) {
    console.error(`API Error - PUT /api/opportunities/${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to update opportunity' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dal = getDirectDAL()
    await dal.opportunities.deleteOpportunity(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`API Error - DELETE /api/opportunities/${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete opportunity' },
      { status: 500 }
    )
  }
}