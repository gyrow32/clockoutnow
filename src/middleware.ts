import { NextRequest, NextResponse } from 'next/server'
import { getClientDomainConfig } from '@/config/client-domains'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const config = getClientDomainConfig(hostname)

  // Not a client domain — pass through for normal ClockOutNow traffic
  if (!config) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // --- www redirect: 301 to bare domain ---
  if (hostname.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = config.domain
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  // --- Serve robots.txt for client domain ---
  if (pathname === '/robots.txt') {
    const body = `User-agent: *\nAllow: /\n\nSitemap: https://${config.domain}/sitemap.xml\n`
    return new NextResponse(body, {
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // --- Serve sitemap.xml for client domain ---
  if (pathname === '/sitemap.xml') {
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${config.domain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`
    return new NextResponse(body, {
      headers: { 'Content-Type': 'application/xml' },
    })
  }

  // --- Let static assets pass through ---
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/preview-images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // --- Block internal paths on client domains ---
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/preview') ||
    pathname.startsWith('/demo') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/portfolio') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 302)
  }

  // --- Root path: rewrite to client-site route handler ---
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/client-site/${config.slug}`
    return NextResponse.rewrite(url)
  }

  // --- Catch-all: redirect unknown paths to root ---
  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url, 302)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
