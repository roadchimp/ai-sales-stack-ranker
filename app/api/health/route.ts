// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { getDirectDAL } from '@/lib/api-client'

export async function GET() {
  try {
    const dal = getDirectDAL()
    const isHealthy = await dal.healthCheck()
    
    if (isHealthy) {
      return NextResponse.json({ success: true, status: 'healthy' })
    } else {
      return NextResponse.json(
        { success: false, status: 'unhealthy' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('API Error - GET /api/health:', error)
    return NextResponse.json(
      { success: false, status: 'error', error: 'Health check failed' },
      { status: 500 }
    )
  }
}