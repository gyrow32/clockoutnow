import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyClientAuth } from '@/lib/client-auth'

/**
 * PATCH /api/client/[slug]/images/reorder — auth required, bulk reorder
 * Body: { order: [{ id: string, display_order: number }] }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!verifyClientAuth(req, slug)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const order = body.order as { id: string; display_order: number }[]

  if (!Array.isArray(order) || order.length === 0) {
    return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
  }

  // Update each image's display_order
  const updates = order.map(({ id, display_order }) =>
    supabaseAdmin
      .from('client_images')
      .update({ display_order })
      .eq('id', id)
      .eq('client_slug', slug)
  )

  const results = await Promise.all(updates)
  const failed = results.filter(r => r.error)

  if (failed.length > 0) {
    console.error('Reorder errors:', failed.map(r => r.error))
    return NextResponse.json({ error: 'Some updates failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
