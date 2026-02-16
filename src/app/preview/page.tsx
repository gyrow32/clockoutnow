import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preview Pages',
  description: 'Custom landing page previews built for local businesses.',
  robots: { index: false, follow: false },
}

interface PageInfo {
  slug: string
  title: string
  business: string
  location: string
}

function getPreviewPages(): PageInfo[] {
  const dir = path.join(process.cwd(), 'public', 'preview-pages')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => {
      const slug = f.replace('.html', '')
      const html = fs.readFileSync(path.join(dir, f), 'utf-8')

      // Extract <title> from HTML
      const titleMatch = html.match(/<title>(.*?)<\/title>/i)
      const rawTitle = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : slug

      // Parse "Business Name | Location | Tagline"
      const parts = rawTitle.split('|').map((p) => p.trim())
      const business = parts[0] || slug
      const location = parts[1] || ''

      return { slug, title: rawTitle, business, location }
    })
    .sort((a, b) => a.business.localeCompare(b.business))
}

export default function PreviewIndex() {
  const pages = getPreviewPages()

  return (
    <div className="min-h-screen bg-charcoal-900 dot-pattern">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-custom">
          <p className="section-label">Our Work</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Landing Page <span className="gradient-text">Previews</span>
          </h1>
          <p className="text-lg md:text-xl text-charcoal-300 max-w-2xl mb-8">
            Custom-built landing pages for local businesses. Each one is a free
            preview — no strings attached.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-600/15 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {pages.length} {pages.length === 1 ? 'page' : 'pages'} live
          </div>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="pb-20">
        <div className="container-custom">
          {pages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-charcoal-700 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
              </div>
              <p className="text-charcoal-300 text-lg">No preview pages yet.</p>
              <p className="text-charcoal-400 text-sm mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <a
                  key={page.slug}
                  href={`/preview/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-card-hover overflow-hidden"
                >
                  {/* Card Top */}
                  <div className="relative h-40 bg-gradient-to-br from-green-800/40 to-charcoal-900 flex items-center justify-center overflow-hidden">
                    <div className="text-center px-6 relative z-10">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-600/20 border border-green-600/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4AA87A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold">{page.business}</p>
                      {page.location && (
                        <p className="text-charcoal-300 text-xs mt-1">{page.location}</p>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/5 transition-colors duration-300" />
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-green-400 transition-colors">
                      {page.business}
                    </h3>
                    <p className="text-charcoal-400 text-sm line-clamp-2">{page.title}</p>
                    <div className="mt-4 flex items-center gap-2 text-coral-400 text-sm font-medium">
                      View preview
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="cta-section">
            <div className="cta-bg rounded-2xl p-8 md:p-14 text-center">
              <p className="section-label !text-green-400 mb-2">Free, No Strings Attached</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Want a preview for your business?
              </h2>
              <p className="text-charcoal-300 mb-8 max-w-lg mx-auto">
                We&apos;ll build you a custom landing page — for free. See what your
                business could look like online before you spend a dime.
              </p>
              <Link href="/contact" className="btn-coral">
                Get Your Free Preview
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
