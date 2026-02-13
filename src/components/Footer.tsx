'use client'

import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `mailto:gyrow32@gmail.com?subject=Free Consultation Request&body=Hi, I'm interested in learning more about your automation services. My email is ${email}.`
    setSubmitted(true)
  }

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
                  Get Your Time Back
                </span>
                <span className="text-sm text-charcoal-300">
                  Small Business Automation
                </span>
              </div>
            </div>

            <p className="text-charcoal-300 text-sm leading-relaxed mb-8 max-w-md">
              We build custom AI tools to automate your busywork. Serving Buffalo, Rochester,
              Syracuse, and the surrounding areas. Stop grinding, start growing.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Navigate</h3>
                <ul className="space-y-2">
                  <li><a href="#how-it-works" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">How It Works</a></li>
                  <li><a href="#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Services</a></li>
                  <li><a href="#about" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">About Us</a></li>
                  <li><a href="#contact" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Services</h3>
                <ul className="space-y-2">
                  <li><a href="#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">AI Chatbots</a></li>
                  <li><a href="#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Automation</a></li>
                  <li><a href="#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Web Development</a></li>
                  <li><a href="#services" className="text-charcoal-300 hover:text-coral-400 text-sm transition-colors">Web Scraping</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-charcoal-300 mb-6">
              Drop your email and we&apos;ll reach out within 24 hours for a free consultation.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-5 py-3.5 rounded-xl bg-charcoal-700 border border-charcoal-600 text-white placeholder:text-charcoal-400 focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500 transition-colors"
                  />
                </div>
                <button type="submit" className="btn-coral w-full justify-center text-base">
                  Get My Free Consultation
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
                <p className="text-charcoal-400 text-xs text-center">
                  Free consultation &middot; No commitment &middot; We speak plain English
                </p>
              </form>
            ) : (
              <div className="bg-green-600/20 border border-green-600/30 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-white font-semibold mb-1">We&apos;ll be in touch!</p>
                <p className="text-charcoal-300 text-sm">Check your inbox within 24 hours.</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-charcoal-700 flex items-center gap-6">
              <a
                href="mailto:gyrow32@gmail.com"
                className="flex items-center gap-2 text-charcoal-300 hover:text-coral-400 text-sm transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                gyrow32@gmail.com
              </a>
              <span className="text-charcoal-300 text-sm">Buffalo, NY</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-charcoal-400 text-sm">
            &copy; {new Date().getFullYear()} Get Your Time Back. All rights reserved.
          </p>
          <p className="text-charcoal-500 text-xs">
            Buffalo, NY &middot; Serving Western New York
          </p>
        </div>
      </div>
    </footer>
  )
}
