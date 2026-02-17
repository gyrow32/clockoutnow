'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'

interface PageInfo {
  slug: string
  title: string
  business: string
  location: string
}

const ACCESS_KEY = 'clockout'

function PreviewContent() {
  const [pages, setPages] = useState<PageInfo[]>([])
  const [authorized, setAuthorized] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [error, setError] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('key') === ACCESS_KEY) {
      setAuthorized(true)
      fetchPages()
    }
  }, [searchParams])

  function fetchPages() {
    fetch('/api/preview-pages')
      .then((r) => r.json())
      .then(setPages)
      .catch(() => {})
  }

  function handleUnlock() {
    if (keyInput.trim() === ACCESS_KEY) {
      setAuthorized(true)
      setError(false)
      fetchPages()
    } else {
      setError(true)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="section-label">Our Work</span>
                <h1 className="section-title mt-4 max-w-3xl">
                  Landing Page{' '}
                  <span className="text-green-600">Previews</span>
                </h1>
                <p className="section-subtitle mt-4 max-w-2xl text-charcoal-400">
                  Custom-built landing pages for local businesses. Each one is a free
                  preview — no strings attached.
                </p>
              </div>

              {/* Key input — right side */}
              {!authorized && (
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={keyInput}
                      onChange={(e) => { setKeyInput(e.target.value); setError(false) }}
                      onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                      placeholder="Access key"
                      className={`w-36 px-3 py-2 text-sm rounded-lg border bg-white text-charcoal-800 outline-none transition-colors ${
                        error
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-charcoal-200 focus:border-green-600'
                      }`}
                    />
                    <button
                      onClick={handleUnlock}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      Unlock
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-1.5">Invalid key</p>
                  )}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="pb-20">
        <div className="container-custom">
          {!authorized ? (
            <AnimatedSection>
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-300 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <p className="text-charcoal-500 text-lg">Enter access key to view previews</p>
              </div>
            </AnimatedSection>
          ) : pages.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-300 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                  </svg>
                </div>
                <p className="text-charcoal-500 text-lg">No preview pages yet.</p>
                <p className="text-charcoal-400 text-sm mt-2">Check back soon!</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page, i) => (
                <AnimatedSection key={page.slug} delay={i * 0.08}>
                  <a
                    href={`/preview/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="card h-full group cursor-pointer !p-0 overflow-hidden">
                      {/* Card Header */}
                      <div className="h-40 bg-gradient-to-br from-green-800 to-charcoal-800 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 grid-pattern opacity-50" />
                        <div className="text-center px-6 relative z-10">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <line x1="3" y1="9" x2="21" y2="9" />
                              <line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                          </div>
                          <p className="text-white font-semibold">{page.business}</p>
                          {page.location && (
                            <p className="text-white/60 text-xs mt-1">{page.location}</p>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <h3 className="text-charcoal-800 font-semibold text-lg mb-1 group-hover:text-green-600 transition-colors">
                          {page.business}
                        </h3>
                        <p className="text-charcoal-400 text-sm line-clamp-2">{page.title}</p>
                        <div className="mt-4 flex items-center gap-2 text-coral-500 text-sm font-medium">
                          View preview
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden bg-charcoal-800">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Want One for <span className="text-coral-400">Your Business?</span>
            </h2>
            <p className="text-charcoal-300 text-lg max-w-xl mx-auto mb-10">
              We&apos;ll build you a custom landing page — for free. See what your
              business could look like online before you spend a dime.
            </p>
            <Link href="/contact" className="btn-coral text-base px-8 py-4">
              Get Your Free Preview
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

export default function PreviewIndex() {
  return (
    <Suspense fallback={null}>
      <PreviewContent />
    </Suspense>
  )
}
