'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'

const team = [
  {
    name: 'Mike',
    role: 'Founder',
    bio: 'Over 30 years running businesses. Mike knows what it\'s like to miss calls, chase invoices, and wear every hat in the company. That\'s why he started ClockOutNow — to give other business owners the tools he wished he had.',
    avatar: 'MK',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    name: 'Abuzar',
    role: 'Lead Developer',
    bio: 'Full-stack developer who turns business problems into working software. Abuzar builds the chatbots, websites, and automation systems that power ClockOutNow. He makes the tech simple so you don\'t have to think about it.',
    avatar: 'AM',
    gradient: 'from-primary-500 to-cyan-400',
  },
]

const values = [
  {
    title: 'No Jargon, Ever',
    description: 'We explain everything in plain English. If we can\'t explain it simply, we don\'t understand it well enough.',
    icon: '💬',
  },
  {
    title: 'Built for Tradespeople',
    description: 'Every tool we build is designed for people who work with their hands — not Silicon Valley startups.',
    icon: '🔧',
  },
  {
    title: 'Results You Can See',
    description: 'More leads, fewer missed calls, less time on the phone. If it doesn\'t move the needle, we don\'t build it.',
    icon: '📈',
  },
  {
    title: 'We\'re Right Here',
    description: 'Based in Lancaster, NY — serving Buffalo, Cheektowaga, Lockport, and all of WNY. We\'re local, we\'re available, and we actually pick up the phone.',
    icon: '📍',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="container-custom">
          <AnimatedSection>
            <span className="section-label">About Us</span>
            <h1 className="section-title mt-4 max-w-3xl">
              We Build AI Tools for Businesses That{' '}
              <span className="text-green-600">Work With Their Hands</span>
            </h1>
            <p className="section-subtitle mt-4 max-w-2xl text-charcoal-400">
              Based in Lancaster, NY, we help Buffalo-area plumbers, roofers, HVAC techs,
              cleaners, and other service businesses stop losing leads and start
              growing — with simple AI automation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="card p-8 h-full">
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-bold`}>
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="text-charcoal-800 text-xl font-bold">{member.name}</h3>
                      <p className="text-green-600 text-sm font-medium">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-charcoal-500 leading-relaxed">{member.bio}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">How We Work</span>
              <h2 className="section-title mt-4">
                What We <span className="text-green-600">Believe In</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <div className="card p-6 h-full">
                  <div className="text-3xl mb-4">{value.icon}</div>
                  <h3 className="text-charcoal-800 font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-charcoal-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Local Image Banner */}
      <section className="relative h-64 overflow-hidden">
        <img src="/buffalo-waterfront.jpg" alt="Buffalo, NY waterfront" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-800/60 flex items-center justify-center">
          <p className="text-white text-2xl sm:text-3xl font-bold text-center px-4">
            Proudly Serving Buffalo &amp; Western New York
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden bg-charcoal-800">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Let&apos;s Talk About <span className="text-coral-400">Your Business</span>
            </h2>
            <p className="text-charcoal-300 text-lg max-w-xl mx-auto mb-10">
              15 minutes. No pressure. Just a conversation about what&apos;s
              eating your time and how we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+16072253400" className="btn-coral text-base px-8 py-4">
                Call Our AI Agent: (607) 225-3400
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
              <Link href="/contact" className="btn-secondary text-base px-8 py-4 text-white border-white/20 hover:bg-white/10">
                Get In Touch
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
