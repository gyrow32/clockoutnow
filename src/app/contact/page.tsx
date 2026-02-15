'use client'

import { useState, FormEvent } from 'react'
import AnimatedSection from '@/components/AnimatedSection'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    phone: '',
    message: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')

    try {
      const { submitBooking } = await import('@/lib/supabase')
      await submitBooking({
        name: formData.name,
        email: formData.phone,
        company: formData.business,
        service: 'General Inquiry',
        message: formData.message,
      })
      setFormStatus('success')
      setFormData({ name: '', business: '', phone: '', message: '' })
    } catch {
      const subject = encodeURIComponent('New Inquiry from ClockOutNow Website')
      const body = encodeURIComponent(
        `Name: ${formData.name}\nBusiness: ${formData.business}\nPhone: ${formData.phone}\n\nWhat's eating their time:\n${formData.message}`
      )
      window.open(`mailto:gyrow32@gmail.com?subject=${subject}&body=${body}`)
      setFormStatus('success')
      setFormData({ name: '', business: '', phone: '', message: '' })
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="container-custom">
          <AnimatedSection>
            <span className="section-label">Contact Us</span>
            <h1 className="section-title mt-4 max-w-3xl">
              Let&apos;s Talk About{' '}
              <span className="text-green-600">Your Business</span>
            </h1>
            <p className="section-subtitle mt-4 max-w-2xl text-charcoal-400">
              Tell us a little about what you do and what&apos;s taking up too
              much of your time. We&apos;ll get back to you within 24 hours.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="card p-6 md:p-8">
                  <h2 className="text-charcoal-800 text-xl font-bold mb-6">Tell Us About Your Business</h2>

                  {formStatus === 'success' ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🎉</div>
                      <h3 className="text-charcoal-800 text-xl font-bold mb-2">
                        Got It!
                      </h3>
                      <p className="text-charcoal-400 mb-6">
                        We&apos;ll be in touch within 24 hours. Talk soon.
                      </p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className="btn-secondary"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-charcoal-600 text-sm font-medium mb-2">
                            Your Name *
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-cream-300 rounded-lg text-charcoal-800 placeholder-charcoal-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label htmlFor="business" className="block text-charcoal-600 text-sm font-medium mb-2">
                            Your Business
                          </label>
                          <input
                            id="business"
                            type="text"
                            value={formData.business}
                            onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-cream-300 rounded-lg text-charcoal-800 placeholder-charcoal-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                            placeholder="Smith Plumbing LLC"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-charcoal-600 text-sm font-medium mb-2">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-cream-300 rounded-lg text-charcoal-800 placeholder-charcoal-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                          placeholder="(716) 555-1234"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-charcoal-600 text-sm font-medium mb-2">
                          What&apos;s eating your time? *
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-cream-300 rounded-lg text-charcoal-800 placeholder-charcoal-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors resize-none"
                          placeholder="I spend 2 hours a day returning calls and scheduling jobs..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="btn-coral w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>

                      {formStatus === 'error' && (
                        <p className="text-red-400 text-sm text-center">
                          Something went wrong. Please try again or call us directly.
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatedSection delay={0.1}>
                <div className="card p-6">
                  <h3 className="text-charcoal-800 font-semibold mb-4">Prefer to Talk?</h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:gyrow32@gmail.com"
                      className="flex items-center gap-3 text-charcoal-500 hover:text-green-600 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center group-hover:bg-green-600/10 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-charcoal-700">Email</div>
                        <div className="text-sm">gyrow32@gmail.com</div>
                      </div>
                    </a>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="card p-6">
                  <h3 className="text-charcoal-800 font-semibold mb-4">What to Expect</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-charcoal-500 text-sm">We respond within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-charcoal-500 text-sm">15-minute call, no pressure</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-charcoal-500 text-sm">Plain English, no tech jargon</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-charcoal-500 text-sm">Free consultation, no commitment</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="card p-6">
                  <h3 className="text-charcoal-800 font-semibold mb-3">Common Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-charcoal-700 text-sm font-medium">How fast can you get this set up?</h4>
                      <p className="text-charcoal-400 text-sm mt-1">Most projects are live in 1–2 weeks.</p>
                    </div>
                    <div>
                      <h4 className="text-charcoal-700 text-sm font-medium">Do I need to be tech-savvy?</h4>
                      <p className="text-charcoal-400 text-sm mt-1">Not at all. If you can use a phone, you can use our tools.</p>
                    </div>
                    <div>
                      <h4 className="text-charcoal-700 text-sm font-medium">What if it doesn&apos;t work for my business?</h4>
                      <p className="text-charcoal-400 text-sm mt-1">We&apos;ll tell you honestly on the first call. No hard sell.</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
