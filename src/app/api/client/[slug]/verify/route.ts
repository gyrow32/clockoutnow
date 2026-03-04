import { NextRequest, NextResponse } from 'next/server'
import { verifyClientAuth } from '@/lib/client-auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!verifyClientAuth(req, slug)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
