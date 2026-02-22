import { NextRequest, NextResponse } from 'next/server'
import {
  getAllCampaigns,
  createCampaign,
  getCampaignSummary,
  CreateCampaignInput,
} from '@/lib/supabase-queries'

const ADMIN_KEY = (process.env.ADMIN_ACCESS_KEY || 'buffalo2026').trim()

/**
 * Verify admin access key from request headers
 */
function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false

  // Support both "Bearer token" and just "token"
  const token = authHeader.replace('Bearer ', '').trim()
  return token === ADMIN_KEY
}

/**
 * GET /api/admin/campaigns
 * Fetch all campaigns with summary stats
 */
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [campaigns, summary] = await Promise.all([
      getAllCampaigns(),
      getCampaignSummary(),
    ])

    return NextResponse.json({
      campaigns,
      summary,
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/campaigns
 * Create a new campaign
 */
export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Validate required fields
    const { business_name, contact, preview_page_slug } = body as CreateCampaignInput
    if (!business_name || !contact || !preview_page_slug) {
      return NextResponse.json(
        { error: 'Missing required fields: business_name, contact, preview_page_slug' },
        { status: 400 }
      )
    }

    const campaign = await createCampaign(body)

    // Generate tracking URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clockoutnow.com'
    const trackingUrl = `${baseUrl}/preview/${preview_page_slug}?utm_source=email&utm_campaign=${campaign.id}`

    return NextResponse.json({
      campaign,
      tracking_url: trackingUrl,
    })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
