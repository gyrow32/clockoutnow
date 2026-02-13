'use client'

import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/AnimatedSection'
import ServiceIcon from '@/components/ServiceIcon'
import { testimonials } from '@/data/testimonials'

const benefits = [
  {
    title: 'Always On, Never Tired',
    description:
      'Your new digital assistant handles tasks 24/7. No coffee breaks, no sick days. It works while you sleep so you can focus on what matters.',
    icon: (
      <svg className="w-7 h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Precision Accuracy',
    description:
      'Tired of copy-paste errors throwing off your books? Automation doesn\'t make typos. Your data stays clean, your reports stay accurate.',
    icon: (
      <svg className="w-7 h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'Affordable & Fast',
    description:
      'You don\'t need an enterprise budget. Our solutions are built for businesses looking for high impact without high overhead. ROI in weeks, not years.',
    icon: (
      <svg className="w-7 h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

const useCases = [
  {
    icon: 'MessageSquare',
    title: 'The 24/7 Customer Assistant',
    description:
      'Customers asking the same questions over and over? We build AI chatbots that handle inquiries instantly, pulling from your own knowledge base. Your team focuses on the hard stuff.',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: 'Workflow',
    title: 'The Workflow Automator',
    description:
      'Still manually moving data between systems? We connect your tools so information flows automatically. Enter it once, it updates everywhere.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: 'Search',
    title: 'The Data Gatherer',
    description:
      'Need product data, market prices, or competitor info? We build scrapers that collect, clean, and deliver the data you need on autopilot.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: 'Plug',
    title: 'The System Connector',
    description:
      'Your CRM doesn\'t talk to your inventory system? We build custom APIs and integrations that make your tools work together seamlessly.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: 'Globe',
    title: 'The Custom Dashboard',
    description:
      'Struggling with off-the-shelf software that doesn\'t fit? We build simple, custom web apps that do exactly what you need. Nothing more, nothing less.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: 'Chrome',
    title: 'The Browser Superpower',
    description:
      'Doing repetitive tasks in your browser? We build Chrome extensions that add buttons, automate clicks, and integrate with your CRM directly in the page.',
    gradient: 'from-teal-500 to-cyan-500',
  },
]

const steps = [
  {
    number: '01',
    title: 'We Listen',
    description:
      'We hop on a quick call. You tell us about the task that eats up most of your week. We listen. No jargon, no sales pressure.',
    icon: (
      <svg className="w-10 h-10 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We Build',
    description:
      'We propose a simple, tailored solution with a clear timeline and budget. Then we build custom AI tools to automate your repetitive tasks.',
    icon: (
      <svg className="w-10 h-10 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'You Relax',
    description:
      'We integrate the tool into your workflow. You start getting your time back. Ongoing support included. Stop grinding, start growing.',
    icon: (
      <svg className="w-10 h-10 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Businesses' },
  { value: '1000+', label: 'Hours Saved Monthly' },
  { value: '99%', label: 'Client Satisfaction' },
]

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════════════
          HERO — Split screen: Empathetic headline + image
         ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-40" />

        <div className="relative container-custom pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="animate-fade-in">
              <div>
                <span className="section-label">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI Solutions That Speak Plain English
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mt-6">
                Navigate Today&apos;s Business World{' '}
                <span className="gradient-text">Without the Burnout.</span>
              </h1>

              <p className="text-lg md:text-xl text-dark-400 mt-6 max-w-lg leading-relaxed">
                We build custom AI tools to automate your repetitive tasks.
                Stop grinding, start growing. We&apos;re here to help.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/contact" className="btn-warm text-base px-8 py-4">
                  Tell Us Your Biggest Headache
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/portfolio" className="btn-secondary text-base px-8 py-4">
                  See Our Work
                </Link>
              </div>

              <p className="text-dark-500 text-sm mt-6">
                Free consultation &middot; No tech jargon &middot; We speak plain English
              </p>
            </div>

            {/* Right — Hero Image */}
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Business professionals collaborating with technology"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Floating stats card */}
                <div className="absolute bottom-4 left-4 card-warm p-4 backdrop-blur-sm bg-white/80 dark:bg-dark-900/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">12 hrs/week saved</div>
                      <div className="text-dark-500 text-xs">Average client result</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          PAIN VALIDATION — "We Understand the Pressure"
         ════════════════════════════════════════════════ */}
      <section className="section-padding relative bg-dark-900/30 border-y border-dark-800/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Image */}
            <AnimatedSection>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80"
                  alt="Overwhelmed business owner dealing with manual tasks"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            {/* Right — Copy */}
            <AnimatedSection delay={0.1}>
              <h2 className="section-title">
                We Understand the <span className="gradient-text">Pressure.</span>
              </h2>
              <div className="mt-6 space-y-4 text-dark-300 text-lg leading-relaxed">
                <p>
                  If you&apos;re spending hours manually copying data between systems,
                  chasing invoices, digging through messy spreadsheets, or replying
                  to the same customer questions over and over...
                </p>
                <p className="font-semibold text-white">
                  It&apos;s not your fault. But it is holding you back.
                </p>
                <p>
                  Manual tasks lead to burnout and expensive errors. You need a
                  system that works as hard as you do &mdash; without the stress.
                </p>
              </div>
              <Link href="/contact" className="btn-warm mt-8">
                Let Us Handle the Busywork
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BENEFITS — "Your New Digital Helper"
         ════════════════════════════════════════════════ */}
      <section className="section-padding relative">
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Why Automate?</span>
              <h2 className="section-title mt-4">
                Your New <span className="gradient-text">Digital Helper</span> Never Sleeps
              </h2>
              <p className="section-subtitle mx-auto">
                Think of it as hiring a super-reliable assistant who works around the clock,
                never makes typos, and costs a fraction of a full-time hire.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 0.1}>
                <div className="card-warm p-8 h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                    {b.icon}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{b.title}</h3>
                  <p className="text-dark-400 leading-relaxed">{b.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          USE CASES — "What Can We Take Off Your Plate?"
         ════════════════════════════════════════════════ */}
      <section className="section-padding relative bg-dark-900/30 border-y border-dark-800/50">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">What We Build</span>
              <h2 className="section-title mt-4">
                What Can We Take <span className="gradient-text">Off Your Plate</span> Today?
              </h2>
              <p className="section-subtitle mx-auto">
                Real solutions for real business headaches. No buzzwords, just tools that
                save you time and money.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <AnimatedSection key={uc.title} delay={i * 0.05}>
                <Link href="/services">
                  <div className="card-warm p-6 h-full group cursor-pointer hover:border-primary-500/30">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${uc.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <ServiceIcon name={uc.icon} className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors">
                      {uc.title}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed">
                      {uc.description}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center mt-12">
              <Link href="/services" className="btn-secondary">
                Explore All Services
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS — 3 Simple Steps
         ════════════════════════════════════════════════ */}
      <section className="section-padding relative">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">How It Works</span>
              <h2 className="section-title mt-4">
                How We Get <span className="gradient-text">Your Time</span> Back
              </h2>
              <p className="section-subtitle mx-auto">
                No complicated onboarding. No 6-month timelines.
                Just three simple steps to freedom.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.15}>
                <div className="bg-sky-50/80 dark:bg-dark-800/50 border border-sky-100 dark:border-dark-700/50 rounded-2xl p-8 text-center h-full transition-colors duration-300">
                  <div className="flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <div className="inline-block bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Step {step.number}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-dark-400 leading-relaxed text-sm">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SOCIAL PROOF — Stats Bar
         ════════════════════════════════════════════════ */}
      <section className="relative border-y border-dark-800/50 bg-dark-900/30">
        <div className="container-custom py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-dark-400 text-sm mt-1">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TESTIMONIALS — Client Success Stories
         ════════════════════════════════════════════════ */}
      <section className="section-padding relative">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Success Stories</span>
              <h2 className="section-title mt-4">
                Client <span className="gradient-text">Success Stories</span>
              </h2>
              <p className="section-subtitle mx-auto">
                Don&apos;t take our word for it. Here&apos;s what businesses like yours
                have to say about working with us.
              </p>
            </div>
          </AnimatedSection>

          {/* Featured testimonial with image */}
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"
                  alt="Client success meeting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-emerald-500 text-6xl font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-dark-200 text-xl leading-relaxed mb-6">
                  {testimonials[0].content}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold preserve-white">
                    {testimonials[0].avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonials[0].name}</div>
                    <div className="text-dark-500 text-sm">{testimonials[0].role}, {testimonials[0].company}</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Remaining testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(1, 4).map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.05}>
                <div className="card-warm p-6 h-full flex flex-col">
                  {/* Quote mark */}
                  <div className="text-primary-400 text-4xl font-serif leading-none mb-3">&ldquo;</div>

                  {/* Content */}
                  <p className="text-dark-300 leading-relaxed flex-1 mb-5">
                    {t.content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-dark-700/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold preserve-white">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{t.name}</div>
                      <div className="text-dark-500 text-xs">{t.role}, {t.company}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CTA — Final conversion
         ════════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden cta-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-dark-900 to-emerald-950 cta-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="relative container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Ready to Automate the <span className="gradient-text">Busywork</span>?
            </h2>
            <p className="text-dark-300 text-lg max-w-xl mx-auto mb-10">
              Don&apos;t let another week go by drowning in manual tasks.
              Let&apos;s talk about a solution &mdash; it&apos;s free, and we speak plain English, not &ldquo;tech.&rdquo;
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-warm text-base px-8 py-4">
                Schedule Your Free Consultation
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <a href="mailto:abuzarmirza918@gmail.com" className="btn-secondary text-base px-8 py-4">
                Email Us Directly
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
