import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preview Pages | ClockOutNow',
  description: 'Custom landing page previews built for local businesses.',
  robots: { index: false, follow: false },
}

interface PageInfo {
  slug: string
  title: string
  business: string
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

      // Use first part before | as business name
      const business = rawTitle.split('|')[0].trim()

      return { slug, title: rawTitle, business }
    })
    .sort((a, b) => a.business.localeCompare(b.business))
}

export default function PreviewIndex() {
  const pages = getPreviewPages()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium mb-6 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to ClockOutNow
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Preview Pages
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Custom-built landing pages for local businesses. Each page is a free
            preview showing what a professional online presence looks like.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-600/15 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {pages.length} {pages.length === 1 ? 'page' : 'pages'} live
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {pages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No preview pages yet.</p>
            <p className="text-sm mt-2">
              Drop HTML files into <code className="bg-gray-200 px-2 py-1 rounded text-sm">public/preview-pages/</code> to get started.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/preview/${page.slug}`}
                className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-300 transition-all duration-300"
              >
                {/* Preview Thumbnail */}
                <div className="relative bg-gradient-to-br from-charcoal-800 to-charcoal-900 h-44 flex items-center justify-center overflow-hidden">
                  <div className="text-center px-6">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-600/20 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-lg">{page.business}</p>
                  </div>
                  <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/10 transition-colors duration-300" />
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-green-600 transition-colors">
                    {page.business}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{page.title}</p>
                  <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                    View page
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-charcoal-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Want one for your business?
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            We build custom landing pages and AI chatbots for contractors and
            service businesses. Free preview, no commitment.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Get Your Free Preview
          </Link>
        </div>
      </div>
    </div>
  )
}
