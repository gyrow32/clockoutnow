import { NextRequest, NextResponse } from 'next/server'
import { trackPageView } from '@/lib/supabase-queries'

/**
 * POST /api/track-view
 * Track a page view from preview pages
 *
 * This endpoint is called by the tracking script embedded in preview pages.
 * It's designed to be bulletproof - fails silently, no authentication required.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { page, utm_source, utm_campaign, referrer } = body

    if (!page) {
      return NextResponse.json({ error: 'Missing page parameter' }, { status: 400 })
    }

    // Extract slug from page path (e.g., "/preview/buffalo-plumbing" -> "buffalo-plumbing")
    const slug = page.replace(/^\/preview\//, '').replace(/\.html$/, '')

    await trackPageView({
      page_slug: slug,
      utm_source: utm_source || null,
      utm_campaign: utm_campaign || null,
      referrer: referrer || null,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking view:', error)
    // Return 200 anyway to not break preview pages
    return NextResponse.json({ success: false, error: 'Tracking failed' })
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
