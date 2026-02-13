'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

const benefits = [
  {
    title: 'Always On, Never Tired',
    description:
      'Your new digital assistant handles tasks 24/7. No coffee breaks, no sick days. It works while you sleep so you can focus on what matters.',
    icon: (
      <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Precision Accuracy',
    description:
      'Tired of copy-paste errors throwing off your books? Automation doesn\'t make typos. Your data stays clean, your reports stay accurate.',
    icon: (
      <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'Affordable & Local',
    description:
      'You don\'t need an enterprise budget. We\'re right here in Buffalo, building solutions for businesses like yours. ROI in weeks, not years.',
    icon: (
      <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

const steps = [
  {
    number: '01',
    title: 'We Listen',
    description:
      'We hop on a quick call. You tell us about the task that eats up most of your week. We listen. No jargon, no sales pressure.',
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
      'We propose a simple, tailored solution with a clear timeline and budget. Then we build custom AI tools to automate your repetitive tasks.',
    icon: (
      <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

const testimonials = [
  {
    name: 'James R.',
    role: 'Owner',
    company: 'JR Plumbing & Heating',
    content: 'We used to spend 3 hours a day on scheduling and follow-ups. Now it runs itself. Best money I ever spent on the business.',
    avatar: 'JR',
  },
  {
    name: 'Maria S.',
    role: 'Office Manager',
    company: 'Comfort Zone HVAC',
    content: 'The chatbot on our website handles 80% of the questions we used to answer by phone. Our customers love it and we actually close more jobs.',
    avatar: 'MS',
  },
  {
    name: 'Derek L.',
    role: 'Owner',
    company: 'Lakeside Cleaning Co.',
    content: 'I was skeptical about AI, but these guys made it dead simple. I\'m saving about 15 hours a week now. Wish I\'d done it sooner.',
    avatar: 'DL',
  },
]

const services = [
  {
    title: 'AI Chatbots',
    description: 'Customers asking the same questions over and over? We build chatbots that handle inquiries instantly, 24/7.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Workflow Automation',
    description: 'Still manually moving data between systems? We connect your tools so information flows automatically.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Website + AI Combos',
    description: 'Need a website that actually works for you? We build modern sites with built-in AI that captures leads while you sleep.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Data Collection',
    description: 'Need product data, market prices, or competitor info? We build scrapers that collect and deliver data on autopilot.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════
          HERO
         ═══════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="container-custom pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="section-label">
                  AI Solutions That Speak Plain English
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-800 leading-[1.15] mt-6"
              >
                Navigate Today&apos;s Business World{' '}
                <span className="text-green-600">Without the Burnout.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-charcoal-400 mt-6 max-w-lg leading-relaxed"
              >
                We build custom AI tools to automate your repetitive tasks.
                Stop grinding, start growing. We&apos;re here to help.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 mt-10"
              >
                <a href="#contact" className="btn-coral text-base px-8 py-4">
                  Tell Us Your Biggest Headache
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
                Free consultation &middot; No tech jargon &middot; We speak plain English
              </motion.p>
            </div>

            {/* Right — Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
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
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-charcoal-800 text-sm font-bold">12 hrs/week saved</div>
                      <div className="text-charcoal-400 text-xs">Average client result</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          EMPATHY — "We Understand the Pressure"
         ═══════════════════════════════════ */}
      <section className="section-padding relative bg-cream-100">
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
                We Understand the <span className="text-green-600">Pressure.</span>
              </h2>
              <div className="mt-6 space-y-4 text-charcoal-500 text-lg leading-relaxed">
                <p>
                  If you&apos;re spending hours manually copying data between systems,
                  chasing invoices, digging through messy spreadsheets, or replying
                  to the same customer questions over and over...
                </p>
                <p className="font-semibold text-charcoal-800">
                  It&apos;s not your fault. But it is holding you back.
                </p>
                <p>
                  Manual tasks lead to burnout and expensive errors. You need a
                  system that works as hard as you do &mdash; without the stress.
                </p>
              </div>
              <a href="#contact" className="btn-coral mt-8 inline-flex">
                Let Us Handle the Busywork
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW IT WORKS — 3 Simple Steps
         ═══════════════════════════════════ */}
      <section id="how-it-works" className="section-padding relative">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">How It Works</span>
              <h2 className="section-title mt-4">
                How We Get <span className="text-green-600">Your Time</span> Back
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

      {/* ═══════════════════════════════════
          BENEFITS — "Your New Digital Helper"
         ═══════════════════════════════════ */}
      <section id="about" className="section-padding relative bg-cream-100">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Why Automate?</span>
              <h2 className="section-title mt-4">
                Your New <span className="text-green-600">Digital Helper</span> Never Sleeps
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

      {/* ═══════════════════════════════════
          SERVICES — What We Offer
         ═══════════════════════════════════ */}
      <section id="services" className="section-padding relative">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">What We Build</span>
              <h2 className="section-title mt-4">
                What Can We Take <span className="text-green-600">Off Your Plate</span>?
              </h2>
              <p className="section-subtitle mx-auto">
                Real solutions for real business headaches. No buzzwords, just tools that
                save you time and money.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((svc, i) => (
              <AnimatedSection key={svc.title} delay={i * 0.1}>
                <div className="card h-full group">
                  <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
                    {svc.icon}
                  </div>
                  <h3 className="text-charcoal-800 font-semibold text-lg mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-charcoal-400 text-sm leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SOCIAL PROOF — Stats Bar
         ═══════════════════════════════════ */}
      <section className="relative bg-green-600">
        <div className="container-custom py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-green-100 text-sm mt-1">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TESTIMONIALS — Client Success Stories
         ═══════════════════════════════════ */}
      <section className="section-padding relative bg-cream-100">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Success Stories</span>
              <h2 className="section-title mt-4">
                Client <span className="text-green-600">Success Stories</span>
              </h2>
              <p className="section-subtitle mx-auto">
                Don&apos;t take our word for it. Here&apos;s what businesses like yours
                have to say about working with us.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="card h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-coral-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-charcoal-600 leading-relaxed flex-1 mb-5">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-cream-300">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-charcoal-800 text-sm font-semibold">{t.name}</div>
                      <div className="text-charcoal-400 text-xs">{t.role}, {t.company}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA — Final conversion
         ═══════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden bg-charcoal-800">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Automate the <span className="text-coral-400">Busywork</span>?
            </h2>
            <p className="text-charcoal-300 text-lg max-w-xl mx-auto mb-10">
              Don&apos;t let another week go by drowning in manual tasks.
              Let&apos;s talk about a solution &mdash; it&apos;s free, and we speak plain English, not &ldquo;tech.&rdquo;
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#contact" className="btn-coral text-base px-8 py-4">
                Schedule Your Free Consultation
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a href="mailto:gyrow32@gmail.com" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5">
                Email Us Directly
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
