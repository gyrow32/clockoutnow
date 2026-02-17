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

  // Top banner — visible back-to-site navigation
  const topBanner = `
    <div id="clockout-top-bar" style="
      position:fixed;top:0;left:0;right:0;
      background:#111827;
      color:#fff;padding:10px 20px;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      font-size:13px;
      display:flex;align-items:center;justify-content:space-between;
      z-index:99999;
      box-shadow:0 2px 10px rgba(0,0,0,.3);
    ">
      <div style="display:flex;align-items:center;gap:8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Free preview by <a href="https://clockoutnow.com" style="color:#4ade80;text-decoration:none;font-weight:600;">ClockOutNow</a></span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <a href="https://clockoutnow.com" style="
          color:#d1d5db;
          padding:6px 14px;border-radius:6px;
          text-decoration:none;font-weight:500;font-size:12px;
          border:1px solid #374151;
          transition:background .2s,color .2s;
        " onmouseover="this.style.background='#1f2937';this.style.color='#fff'"
           onmouseout="this.style.background='transparent';this.style.color='#d1d5db'">
          Visit Website
        </a>
        <a href="https://clockoutnow.com/contact" style="
          background:#16a34a;color:#fff;
          padding:6px 14px;border-radius:6px;
          text-decoration:none;font-weight:600;font-size:12px;
          transition:background .2s;
        " onmouseover="this.style.background='#15803d'"
           onmouseout="this.style.background='#16a34a'">
          Free Consultation &rarr;
        </a>
      </div>
    </div>
    <div style="height:40px;"></div>`

  // Inject top banner right after <body...>
  html = html.replace(/<body([^>]*)>/, '<body$1>' + topBanner)

  // Floating bottom-right badge
  const floatingBadge = `
    <div style="
      position:fixed;bottom:20px;right:20px;
      background:linear-gradient(135deg,#1a1a2e,#16213e);
      color:#fff;padding:10px 18px;border-radius:50px;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      font-size:13px;font-weight:500;
      box-shadow:0 4px 20px rgba(0,0,0,.3);
      z-index:99999;display:flex;align-items:center;gap:8px;
      cursor:pointer;transition:transform .2s,box-shadow .2s;
    " onmouseover="this.style.transform='scale(1.05)';this.style.boxShadow='0 6px 25px rgba(0,0,0,.4)'"
       onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 4px 20px rgba(0,0,0,.3)'"
       onclick="window.open('https://clockoutnow.com','_blank')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      Built by <strong style="color:#4ade80;margin-left:3px">ClockOutNow</strong>
    </div>`

  html = html.replace('</body>', floatingBadge + '\n</body>')

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
