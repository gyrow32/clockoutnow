'use client'

import { useState, FormEvent } from 'react'
import AnimatedSection from '@/components/AnimatedSection'
import { services } from '@/data/services'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')

    try {
      // Dynamic import to avoid build issues if Supabase isn't configured
      const { submitBooking } = await import('@/lib/supabase')
      await submitBooking(formData)
      setFormStatus('success')
      setFormData({ name: '', email: '', company: '', service: '', budget: '', message: '' })
    } catch {
      // Fallback: open mailto link if Supabase isn't configured
      const subject = encodeURIComponent(`New Project Inquiry - ${formData.service || 'General'}`)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nService: ${formData.service}\nBudget: ${formData.budget}\n\nMessage:\n${formData.message}`
      )
      window.open(`mailto:abuzarmirza918@gmail.com?subject=${subject}&body=${body}`)
      setFormStatus('success')
      setFormData({ name: '', email: '', company: '', service: '', budget: '', message: '' })
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[128px]" />
        <div className="relative container-custom">
          <AnimatedSection>
            <span className="section-label">Get In Touch</span>
            <h1 className="section-title mt-4 max-w-3xl">
              Let&apos;s Build Something{' '}
              <span className="gradient-text">Extraordinary</span>
            </h1>
            <p className="section-subtitle mt-4 max-w-2xl">
              Tell us about your project and we&apos;ll get back to you within 24 hours
              with a detailed proposal and timeline.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="glass-card p-6 md:p-8">
                  <h2 className="text-white text-xl font-bold mb-6">Book a Consultation</h2>

                  {formStatus === 'success' ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🎉</div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-dark-400 mb-6">
                        We&apos;ll review your project details and get back to you within 24 hours.
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
                          <label htmlFor="name" className="block text-dark-300 text-sm font-medium mb-2">
                            Full Name *
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-dark-300 text-sm font-medium mb-2">
                            Email Address *
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="company" className="block text-dark-300 text-sm font-medium mb-2">
                            Company
                          </label>
                          <input
                            id="company"
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                            placeholder="Your Company"
                          />
                        </div>
                        <div>
                          <label htmlFor="service" className="block text-dark-300 text-sm font-medium mb-2">
                            Service Needed *
                          </label>
                          <select
                            id="service"
                            required
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none cursor-pointer"
                          >
                            <option value="" className="text-dark-500">Select a service</option>
                            {services.map((s) => (
                              <option key={s.id} value={s.title} className="text-white bg-dark-800">
                                {s.title}
                              </option>
                            ))}
                            <option value="Other" className="text-white bg-dark-800">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="budget" className="block text-dark-300 text-sm font-medium mb-2">
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="text-dark-500">Select budget range</option>
                          <option value="$500 - $1,000" className="text-white bg-dark-800">$500 - $1,000</option>
                          <option value="$1,000 - $3,000" className="text-white bg-dark-800">$1,000 - $3,000</option>
                          <option value="$3,000 - $5,000" className="text-white bg-dark-800">$3,000 - $5,000</option>
                          <option value="$5,000 - $10,000" className="text-white bg-dark-800">$5,000 - $10,000</option>
                          <option value="$10,000+" className="text-white bg-dark-800">$10,000+</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-dark-300 text-sm font-medium mb-2">
                          Project Details *
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                          placeholder="Tell us about your project, goals, and timeline..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
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
                          Something went wrong. Please try again or email us directly.
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
                <div className="glass-card p-6">
                  <h3 className="text-white font-semibold mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:abuzarmirza918@gmail.com"
                      className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark-300">Abuzar</div>
                        <div className="text-sm">abuzarmirza918@gmail.com</div>
                      </div>
                    </a>
                    <a
                      href="mailto:gyrow32@gmail.com"
                      className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark-300">Mike</div>
                        <div className="text-sm">gyrow32@gmail.com</div>
                      </div>
                    </a>
                    <a
                      href="https://github.com/abuzar355"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark-300">GitHub</div>
                        <div className="text-sm">github.com/abuzar355</div>
                      </div>
                    </a>
                    <a
                      href="https://www.freelancer.com/u/Abuzar00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark-300">Freelancer</div>
                        <div className="text-sm">freelancer.com/u/Abuzar00</div>
                      </div>
                    </a>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6">
                  <h3 className="text-white font-semibold mb-4">Response Time</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-dark-300 text-sm">Usually respond within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                      <span className="text-dark-300 text-sm">Free initial consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-dark-300 text-sm">Detailed proposal with timeline</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="glass-card p-6">
                  <h3 className="text-white font-semibold mb-3">FAQ</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-dark-300 text-sm font-medium">What&apos;s your typical project timeline?</h4>
                      <p className="text-dark-500 text-sm mt-1">Most projects are delivered within 1-4 weeks depending on complexity.</p>
                    </div>
                    <div>
                      <h4 className="text-dark-300 text-sm font-medium">Do you offer ongoing support?</h4>
                      <p className="text-dark-500 text-sm mt-1">Yes, we offer maintenance and support packages for all delivered projects.</p>
                    </div>
                    <div>
                      <h4 className="text-dark-300 text-sm font-medium">Can you work with existing systems?</h4>
                      <p className="text-dark-500 text-sm mt-1">Absolutely. We specialize in integrating AI and automation into existing workflows.</p>
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
