'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-charcoal-800">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Brand + Links */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 flex items-center justify-center bg-green-600 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-white leading-tight block">
                  ClockOutNow
                </span>
                <span className="text-sm text-charcoal-300">
                  AI automation for businesses that work with their hands
                </span>
              </div>
            </div>

            <p className="text-charcoal-300 text-sm leading-relaxed mb-8 max-w-md">
              We build AI chatbots, websites, and booking systems for contractors
              and service businesses. Based in Western New York, serving everywhere.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Navigate</h3>
                <ul className="space-y-2">
                  <li><Link href="/#how-it-works" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">How It Works</Link></li>
                  <li><Link href="/#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Services</Link></li>
                  <li><Link href="/about" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Contact</Link></li>
                  <li><Link href="/preview" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Previews</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="/#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">AI Chatbot</Link></li>
                  <li><Link href="/#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Website + AI</Link></li>
                  <li><Link href="/#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Booking Automation</Link></li>
                  <li><Link href="/#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Custom Solutions</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right — CTA */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Stop Missing Calls?
            </h3>
            <p className="text-charcoal-300 mb-6">
              Get in touch for a free consultation. We&apos;ll show you exactly
              how AI can help your business — in plain English.
            </p>

            <Link href="/contact" className="btn-coral inline-flex text-base">
              Get Your Free Consultation
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <div className="mt-8 pt-6 border-t border-charcoal-700 flex items-center gap-6">
              <a
                href="mailto:hello@clockoutnow.com"
                className="flex items-center gap-2 text-charcoal-300 hover:text-coral-400 text-sm transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                hello@clockoutnow.com
              </a>
              <span className="text-charcoal-300 text-sm">Western New York</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-charcoal-400 text-sm">
            &copy; {new Date().getFullYear()} ClockOutNow. All rights reserved.
          </p>
          <p className="text-charcoal-500 text-xs">
            Western New York &middot; Serving contractors everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
