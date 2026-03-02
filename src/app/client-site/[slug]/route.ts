import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Sanitize: only allow lowercase alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Fetch HTML from public CDN (fs.readFile doesn't work in Vercel serverless)
  const origin = request.nextUrl.origin
  const res = await fetch(`${origin}/preview-pages/${slug}.htm`)
  if (!res.ok) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const html = await res.text()

  // Serve raw HTML — NO ClockOutNow branding injected
  // Allow indexing — NO X-Robots-Tag noindex
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
