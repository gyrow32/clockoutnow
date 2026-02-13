'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'
import ServiceIcon from '@/components/ServiceIcon'
import { services } from '@/data/services'

const process_steps = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We analyze your requirements, understand your business goals, and identify the best technical approach.',
    icon: '🎯',
  },
  {
    step: '02',
    title: 'Architecture',
    description: 'We design scalable, maintainable solutions with clear milestones and transparent communication.',
    icon: '📐',
  },
  {
    step: '03',
    title: 'Development',
    description: 'Our team builds your solution using modern tech stacks with regular progress updates and demos.',
    icon: '⚡',
  },
  {
    step: '04',
    title: 'Deployment',
    description: 'We deploy, test, and optimize your solution for production. Ongoing support included.',
    icon: '🚀',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[128px]" />
        <div className="relative container-custom">
          <AnimatedSection>
            <span className="section-label">Our Services</span>
            <h1 className="section-title mt-4 max-w-3xl">
              Full-Spectrum <span className="gradient-text">AI & Development</span> Services
            </h1>
            <p className="section-subtitle mt-4 max-w-2xl">
              From intelligent chatbots to end-to-end automation, we deliver production-ready
              solutions that solve real business problems and drive measurable results.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 relative">
        <div className="container-custom">
          <div className="space-y-8">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.05}>
                <div id={service.id} className="scroll-mt-24">
                  <div className="glass-card-hover p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      {/* Left */}
                      <div className="flex-1">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5`}>
                          <ServiceIcon name={service.icon} className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">{service.title}</h2>
                        <p className="text-dark-400 leading-relaxed">{service.description}</p>
                      </div>

                      {/* Right - Features */}
                      <div className="md:w-80 lg:w-96">
                        <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-4">
                          What&apos;s Included
                        </h3>
                        <ul className="space-y-3">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 12 2 2 4-4" />
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              <span className="text-dark-300 text-sm">{feature}</span>
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

      {/* Process */}
      <section className="section-padding relative bg-dark-900/30 border-y border-dark-800/50">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">How We Work</span>
              <h2 className="section-title mt-4">
                Our <span className="gradient-text">Process</span>
              </h2>
              <p className="section-subtitle mx-auto">
                A proven approach to delivering exceptional results, on time and on budget.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process_steps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.1}>
                <div className="glass-card p-6 h-full relative">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="text-primary-500 font-mono text-sm font-bold mb-2">
                    Step {step.step}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Technology</span>
              <h2 className="section-title mt-4">
                Our <span className="gradient-text">Tech Stack</span>
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Python', desc: 'AI & Backend' },
                { name: 'TypeScript', desc: 'Full-Stack' },
                { name: 'React', desc: 'Frontend' },
                { name: 'Next.js', desc: 'Web Apps' },
                { name: 'Node.js', desc: 'Backend' },
                { name: 'FastAPI', desc: 'APIs' },
                { name: 'Flask', desc: 'Web Services' },
                { name: 'OpenAI', desc: 'LLMs' },
                { name: 'LangChain', desc: 'AI Chains' },
                { name: 'Supabase', desc: 'Database' },
                { name: 'Selenium', desc: 'Scraping' },
                { name: 'n8n', desc: 'Workflows' },
                { name: 'Docker', desc: 'Deployment' },
                { name: 'AWS', desc: 'Cloud' },
                { name: 'Vercel', desc: 'Hosting' },
                { name: 'Redis', desc: 'Caching' },
                { name: 'Shopify', desc: 'E-Commerce' },
                { name: 'Chrome APIs', desc: 'Extensions' },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="glass-card p-4 text-center hover:border-primary-500/30 transition-colors"
                >
                  <div className="text-white font-medium text-sm">{tech.name}</div>
                  <div className="text-dark-500 text-xs mt-1">{tech.desc}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden cta-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-dark-900 to-emerald-950 cta-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
              Need a Custom Solution? <span className="gradient-text">Let&apos;s Talk.</span>
            </h2>
            <p className="text-dark-300 text-lg max-w-xl mx-auto mb-10">
              Every project is unique. Tell us about your requirements and we&apos;ll design
              the perfect solution for your business.
            </p>
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Get a Free Quote
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
