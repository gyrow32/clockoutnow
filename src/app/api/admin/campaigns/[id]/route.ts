import { NextRequest, NextResponse } from 'next/server'
import { updateCampaign, UpdateCampaignInput } from '@/lib/supabase-queries'

const ADMIN_KEY = (process.env.ADMIN_ACCESS_KEY || 'buffalo2026').trim()

function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '').trim()
  return token === ADMIN_KEY
}

/**
 * PATCH /api/admin/campaigns/[id]
 * Update an existing campaign
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = params.id
    const body = await req.json() as UpdateCampaignInput

    const campaign = await updateCampaign(id, body)

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}
