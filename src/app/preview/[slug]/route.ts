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

  let html = fs.readFileSync(filePath, 'utf-8')

  // Inject floating "Built by ClockOutNow" banner before </body>
  const banner = `
    <div style="
      position:fixed;bottom:20px;right:20px;
      background:linear-gradient(135deg,#1a1a2e,#16213e);
      color:#fff;padding:10px 18px;border-radius:50px;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      font-size:13px;font-weight:500;
      box-shadow:0 4px 20px rgba(0,0,0,.3);
      z-index:99999;display:flex;align-items:center;gap:8px;
      cursor:pointer;transition:transform .2s,box-shadow .2s;
      text-decoration:none;
    " onmouseover="this.style.transform='scale(1.05)';this.style.boxShadow='0 6px 25px rgba(0,0,0,.4)'"
       onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 4px 20px rgba(0,0,0,.3)'"
       onclick="window.open('https://clockoutnow.com','_blank')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      Built by <strong style="color:#4ade80;margin-left:3px">ClockOutNow</strong>
    </div>`

  html = html.replace('</body>', banner + '\n</body>')

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
