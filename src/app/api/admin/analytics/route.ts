import { NextRequest, NextResponse } from 'next/server'
import {
  getPageViewsBySlug,
  getTrafficSources,
  getTotalPageViews,
  getCampaignClickThroughRates,
  getResponseTimeAnalytics,
  getPerformanceOverTime,
  getTopPerformingPages,
} from '@/lib/supabase-queries'

const ADMIN_KEY = (process.env.ADMIN_ACCESS_KEY || 'buffalo2026').trim()

function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '').trim()
  return token === ADMIN_KEY
}

/**
 * GET /api/admin/analytics
 * Get analytics data for the dashboard
 * Query params: ?days=30 (optional)
 */
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30', 10)

    const [
      pageViews,
      trafficSources,
      totalViews,
      campaignCTR,
      responseTime,
      performanceOverTime,
      topPages,
    ] = await Promise.all([
      getPageViewsBySlug(days),
      getTrafficSources(days),
      getTotalPageViews(days),
      getCampaignClickThroughRates(days),
      getResponseTimeAnalytics(),
      getPerformanceOverTime(days),
      getTopPerformingPages(days, 5),
    ])

    return NextResponse.json({
      page_views: pageViews,
      traffic_sources: trafficSources,
      total_views: totalViews,
      campaign_ctr: campaignCTR,
      response_time: responseTime,
      performance_over_time: performanceOverTime,
      top_pages: topPages,
      days,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
