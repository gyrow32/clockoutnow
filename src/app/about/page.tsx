'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'

const team = [
  {
    name: 'Abuzar Mirza',
    role: 'Co-Founder & Lead Developer',
    bio: 'Full-stack developer and AI specialist with deep expertise in Python, Node.js, React, and OpenAI technologies. Passionate about building intelligent systems that solve real business problems. Experienced in RAG chatbots, web scraping, API development, and Chrome extensions.',
    skills: ['Python', 'React', 'OpenAI', 'FastAPI', 'Node.js', 'Selenium', 'Supabase', 'n8n'],
    avatar: 'AM',
    email: 'abuzarmirza918@gmail.com',
    gradient: 'from-primary-500 to-cyan-400',
  },
  {
    name: 'Mike',
    role: 'Co-Founder & Solutions Architect',
    bio: 'Solutions architect and business strategist specializing in AI integration, workflow automation, and enterprise systems. Expert in translating complex business requirements into scalable technical solutions. Drives client relationships and project delivery.',
    skills: ['AI Strategy', 'System Architecture', 'Automation', 'Project Management', 'API Design', 'Cloud Infrastructure'],
    avatar: 'MK',
    email: 'gyrow32@gmail.com',
    gradient: 'from-emerald-500 to-teal-400',
  },
]

const values = [
  {
    title: 'Ship Fast, Ship Right',
    description: 'We believe in rapid delivery without compromising quality. Agile sprints, continuous deployment, and iterative improvement.',
    icon: '🚀',
  },
  {
    title: 'AI-First Approach',
    description: 'Every solution we build leverages AI where it makes sense. Not just buzzwords, but practical, measurable improvements.',
    icon: '🧠',
  },
  {
    title: 'Transparent Communication',
    description: 'Regular updates, clear timelines, and honest feedback. You always know where your project stands.',
    icon: '💬',
  },
  {
    title: 'Production-Ready Always',
    description: 'We don\'t build demos. Every solution is designed, tested, and deployed for real-world production use.',
    icon: '✅',
  },
]

const milestones = [
  { year: '2023', event: 'Founded NexusAI with a focus on AI chatbot development' },
  { year: '2023', event: 'Delivered first enterprise RAG chatbot system' },
  { year: '2024', event: 'Expanded into automation, web scraping, and Chrome extensions' },
  { year: '2024', event: 'Built vehicle inventory AI platform with MCP integration' },
  { year: '2025', event: 'Launched multi-agent AI solutions and e-commerce automation' },
  { year: '2025', event: '50+ projects delivered across 8+ service categories' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[128px]" />
        <div className="relative container-custom">
          <AnimatedSection>
            <span className="section-label">About Us</span>
            <h1 className="section-title mt-4 max-w-3xl">
              Two Builders on a Mission to{' '}
              <span className="gradient-text">Democratize AI</span>
            </h1>
            <p className="section-subtitle mt-4 max-w-2xl">
              We&apos;re a focused team of AI enthusiasts and full-stack developers who believe
              every business deserves access to intelligent, production-ready technology solutions.
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
                <div className="glass-card p-8 h-full">
                  {/* Avatar */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-bold`}>
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">{member.name}</h3>
                      <p className="text-primary-400 text-sm font-medium">{member.role}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-dark-400 leading-relaxed mb-6">{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-lg bg-dark-800 text-dark-300 text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Email */}
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    {member.email}
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-dark-900/30 border-y border-dark-800/50">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Our Values</span>
              <h2 className="section-title mt-4">
                How We <span className="gradient-text">Operate</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <div className="glass-card p-6 h-full">
                  <div className="text-3xl mb-4">{value.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Our Journey</span>
              <h2 className="section-title mt-4">
                Key <span className="gradient-text">Milestones</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
                    {i < milestones.length - 1 && (
                      <div className="w-px h-full bg-dark-700 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-primary-400 font-mono text-sm font-bold">{milestone.year}</span>
                    <p className="text-dark-300 mt-1">{milestone.event}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden border-t border-dark-800/50 cta-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-dark-900 to-emerald-950 cta-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
              Let&apos;s Build the Future <span className="gradient-text">Together</span>
            </h2>
            <p className="text-dark-300 text-lg max-w-xl mx-auto mb-10">
              Whether you need an AI chatbot, automation workflow, or a full-stack application,
              we&apos;re ready to make it happen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">
                Get In Touch
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link href="/portfolio" className="btn-secondary text-base px-8 py-4">
                See Our Work
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
