import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Sanitize: only allow lowercase alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'public', 'preview-pages', `${slug}.html`)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const html = fs.readFileSync(filePath, 'utf-8')

  // Serve raw HTML — NO ClockOutNow branding injected
  // Allow indexing — NO X-Robots-Tag noindex
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
