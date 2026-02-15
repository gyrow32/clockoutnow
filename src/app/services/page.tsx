'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'
import { services } from '@/data/services'

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="container-custom">
          <AnimatedSection>
            <span className="section-label">Our Services</span>
            <h1 className="section-title mt-4 max-w-3xl">
              Simple Tools That{' '}
              <span className="text-green-600">Get You More Jobs</span>
            </h1>
            <p className="section-subtitle mt-4 max-w-2xl text-charcoal-400">
              No fancy tech. Just AI chatbots, professional websites, and booking systems
              that bring in leads while you&apos;re on the job.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="pb-20 relative">
        <div className="container-custom">
          <div className="space-y-8">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.05}>
                <div id={service.id} className="scroll-mt-24">
                  <div className="card p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-charcoal-800 mb-1">{service.title}</h2>
                        <div className="mb-4">
                          {service.originalPrice && (
                            <p className="text-charcoal-400 text-sm line-through">{service.originalPrice}</p>
                          )}
                          <p className="text-green-600 font-semibold">{service.price}</p>
                        </div>
                        <p className="text-charcoal-500 leading-relaxed">{service.description}</p>
                      </div>

                      <div className="md:w-80 lg:w-96">
                        <h3 className="text-sm font-semibold text-charcoal-500 uppercase tracking-wider mb-4">
                          What You Get
                        </h3>
                        <ul className="space-y-3">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 12 2 2 4-4" />
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              <span className="text-charcoal-500 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden bg-charcoal-800">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Not Sure What You Need? <span className="text-coral-400">Let&apos;s Talk.</span>
            </h2>
            <p className="text-charcoal-300 text-lg max-w-xl mx-auto mb-10">
              Tell us what&apos;s eating your time and we&apos;ll recommend the
              right solution. Free, no pressure.
            </p>
            <Link href="/contact" className="btn-coral text-base px-8 py-4">
              Get a Free Consultation
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
