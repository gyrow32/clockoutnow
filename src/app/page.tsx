'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import { scenarios } from '@/data/testimonials'

const benefits = [
  {
    title: 'Never Miss a Lead',
    description:
      'Your phone rings while you\'re on a roof or under a sink. Our AI answers for you, gets the details, and texts you the lead. No more lost jobs.',
    icon: (
      <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: 'Save Hours on Scheduling',
    description:
      'Stop playing phone tag. Customers book online, get automatic confirmations, and your calendar fills itself. You focus on the work.',
    icon: (
      <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Look Professional Online',
    description:
      'Customers Google you before they call. A clean website with real photos of your work and instant AI chat makes you look like the pro you are.',
    icon: (
      <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

const steps = [
  {
    number: '01',
    title: 'We Listen',
    description:
      'Quick call. You tell us what\'s eating your time — missed calls, scheduling headaches, no web presence. We listen, no jargon.',
    icon: (
      <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Build',
    description:
      'We set up your AI chatbot, website, or booking system. Usually ready in 1–2 weeks. You approve everything before it goes live.',
    icon: (
      <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'You Grow',
    description:
      'Leads come in automatically. Your schedule fills up. You spend less time on the phone and more time doing what you\'re good at.',
    icon: (
      <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
]

const serviceCards = [
  {
    title: 'AI Chatbot',
    price: '$500 setup + $99/mo',
    description: 'Answers customer questions 24/7, captures leads, and texts you. Like having a receptionist who never sleeps.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Website + AI Combo',
    price: '$1,200 setup + $99/mo',
    description: 'Professional website that shows up on Google, plus a built-in AI chatbot. Everything a contractor needs online.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Booking Automation',
    price: '$800–$2,000 one-time',
    description: 'Online scheduling, automatic confirmations, follow-up reminders. No more phone tag or no-shows.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Custom Solutions',
    price: 'Custom quote',
    description: 'Got a bigger challenge? CRM, dispatch, multi-location — we\'ll build exactly what your business needs.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-custom pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="section-label">
                  AI Automation for Contractors &amp; Service Businesses
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-800 leading-[1.15] mt-6"
              >
                Stop Losing Jobs to{' '}
                <span className="text-green-600">Missed Calls.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-charcoal-400 mt-6 max-w-lg leading-relaxed"
              >
                You&apos;re great at your trade. We build AI tools that answer your
                calls, book your jobs, and make you look professional online &mdash;
                so you can focus on the work.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 mt-10"
              >
                <a href="#contact" className="btn-coral text-base px-8 py-4">
                  Get a Free Consultation
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
                  See How It Works
                </a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-charcoal-400 text-sm mt-6"
              >
                Free consultation &middot; No contracts &middot; Built for contractors
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                  alt="Contractor working on a job site"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-charcoal-800 text-sm font-bold">New lead captured</div>
                      <div className="text-charcoal-400 text-xs">While you were on the job</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EMPATHY */}
      <section className="section-padding relative bg-cream-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                  alt="Contractor checking phone between jobs"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="section-title">
                We Know the <span className="text-green-600">Hustle.</span>
              </h2>
              <div className="mt-6 space-y-4 text-charcoal-500 text-lg leading-relaxed">
                <p>
                  You&apos;re on a ladder, under a house, or elbow-deep in a job.
                  Your phone rings. You can&apos;t answer. By the time you call back,
                  they&apos;ve already hired someone else.
                </p>
                <p className="font-semibold text-charcoal-800">
                  You&apos;re losing money every time that happens.
                </p>
                <p>
                  We build simple AI tools that catch those leads, handle the
                  back-and-forth, and let you focus on the work that pays.
                </p>
              </div>
              <a href="#contact" className="btn-coral mt-8 inline-flex">
                Let&apos;s Fix That
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-padding relative">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">How It Works</span>
              <h2 className="section-title mt-4">
                Three Steps to <span className="text-green-600">More Jobs</span>
              </h2>
              <p className="section-subtitle mx-auto">
                No complicated setup. No 6-month timelines. Just results.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.15}>
                <div className="bg-white border border-cream-300 rounded-2xl p-8 text-center h-full shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <div className="inline-block bg-green-600/10 text-green-600 font-mono text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Step {step.number}
                  </div>
                  <h3 className="text-charcoal-800 font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-charcoal-400 leading-relaxed text-sm">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="about" className="section-padding relative bg-cream-100">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Why ClockOutNow?</span>
              <h2 className="section-title mt-4">
                Work Smarter, <span className="text-green-600">Not Longer</span>
              </h2>
              <p className="section-subtitle mx-auto">
                You didn&apos;t start your business to sit at a desk all day.
                Let AI handle the busywork so you can do what you&apos;re good at.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 0.1}>
                <div className="card text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-green-600/10 border-2 border-green-600/20 flex items-center justify-center mx-auto mb-5">
                    {b.icon}
                  </div>
                  <h3 className="text-charcoal-800 font-bold text-xl mb-3">{b.title}</h3>
                  <p className="text-charcoal-400 leading-relaxed">{b.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section-padding relative">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">What We Offer</span>
              <h2 className="section-title mt-4">
                Simple Tools That <span className="text-green-600">Get You Paid</span>
              </h2>
              <p className="section-subtitle mx-auto">
                No fancy tech talk. Just tools that bring in more jobs and save you time.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {serviceCards.map((svc, i) => (
              <AnimatedSection key={svc.title} delay={i * 0.1}>
                <div className="card h-full group">
                  <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
                    {svc.icon}
                  </div>
                  <h3 className="text-charcoal-800 font-semibold text-lg mb-1">
                    {svc.title}
                  </h3>
                  <p className="text-green-600 font-medium text-sm mb-3">{svc.price}</p>
                  <p className="text-charcoal-400 text-sm leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SCENARIO STORIES */}
      <section className="section-padding relative bg-cream-100">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Real Results</span>
              <h2 className="section-title mt-4">
                Stories From <span className="text-green-600">the Field</span>
              </h2>
              <p className="section-subtitle mx-auto">
                Here&apos;s what happens when contractors stop losing leads and start using AI.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {scenarios.map((s, i) => (
              <AnimatedSection key={s.id} delay={i * 0.1}>
                <div className="card h-full flex flex-col">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h3 className="text-charcoal-800 font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-charcoal-500 text-sm leading-relaxed mb-3">
                    <span className="font-semibold text-charcoal-700">The problem:</span> {s.problem}
                  </p>
                  <p className="text-charcoal-500 text-sm leading-relaxed mt-auto">
                    <span className="font-semibold text-green-600">The result:</span> {s.result}
                  </p>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Stop <span className="text-coral-400">Missing Calls</span>?
            </h2>
            <p className="text-charcoal-300 text-lg max-w-xl mx-auto mb-10">
              Let&apos;s talk about your business. 15 minutes, no pressure,
              no tech jargon. Just a conversation about how to get you more jobs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#contact" className="btn-coral text-base px-8 py-4">
                Get Your Free Consultation
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a href="mailto:hello@clockoutnow.com" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5">
                Email Us Directly
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
