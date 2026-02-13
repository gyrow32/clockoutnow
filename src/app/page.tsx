'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import ServiceIcon from '@/components/ServiceIcon'
import { services } from '@/data/services'
import { projects } from '@/data/projects'
import { testimonials } from '@/data/testimonials'

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '8+', label: 'AI Solutions' },
  { value: '99%', label: 'Client Satisfaction' },
]

const techLogos = [
  'OpenAI', 'Python', 'React', 'Next.js', 'Node.js', 'Supabase',
  'Flask', 'FastAPI', 'Selenium', 'n8n', 'Shopify', 'Chrome',
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />

        <div className="relative container-custom pt-32 pb-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-label">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AI-Powered Solutions Agency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mt-6"
            >
              We Build{' '}
              <span className="gradient-text">Intelligent AI</span>
              <br />
              Solutions That{' '}
              <span className="gradient-text">Scale</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-dark-400 mt-6 max-w-2xl leading-relaxed"
            >
              From AI chatbots and autonomous agents to workflow automation and
              custom web development. We transform your ideas into production-ready
              solutions that drive real business results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link href="/contact" className="btn-primary text-base px-8 py-4">
                Start Your Project
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link href="/portfolio" className="btn-secondary text-base px-8 py-4">
                View Our Work
              </Link>
            </motion.div>

            {/* Tech Stack Ribbon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <span className="text-dark-500 text-sm font-medium">Built with:</span>
              {techLogos.map((tech) => (
                <span key={tech} className="text-dark-500 text-sm font-mono hover:text-primary-400 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual - Floating Code Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-[380px]"
          >
            <div className="glass-card p-5 glow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-dark-500 text-xs font-mono">nexus-agent.py</span>
              </div>
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  <span className="text-primary-400">from</span>
                  <span className="text-dark-300"> nexusai </span>
                  <span className="text-primary-400">import</span>
                  <span className="text-emerald-400"> Agent</span>
                  {'\n\n'}
                  <span className="text-dark-500"># Initialize AI Agent</span>
                  {'\n'}
                  <span className="text-dark-300">agent = </span>
                  <span className="text-emerald-400">Agent</span>
                  <span className="text-dark-400">(</span>
                  {'\n'}
                  <span className="text-dark-300">{'  '}model=</span>
                  <span className="text-amber-400">&quot;gpt-4o&quot;</span>
                  <span className="text-dark-400">,</span>
                  {'\n'}
                  <span className="text-dark-300">{'  '}tools=</span>
                  <span className="text-dark-400">[</span>
                  <span className="text-amber-400">&quot;search&quot;</span>
                  <span className="text-dark-400">, </span>
                  <span className="text-amber-400">&quot;code&quot;</span>
                  <span className="text-dark-400">],</span>
                  {'\n'}
                  <span className="text-dark-300">{'  '}streaming=</span>
                  <span className="text-primary-400">True</span>
                  {'\n'}
                  <span className="text-dark-400">)</span>
                  {'\n\n'}
                  <span className="text-dark-500"># Deploy to production</span>
                  {'\n'}
                  <span className="text-dark-300">agent.</span>
                  <span className="text-emerald-400">deploy</span>
                  <span className="text-dark-400">(</span>
                  <span className="text-amber-400">&quot;production&quot;</span>
                  <span className="text-dark-400">)</span>
                  {'\n'}
                  <span className="text-emerald-400">{'>'} </span>
                  <span className="text-dark-400">Agent live at </span>
                  <span className="text-primary-400">nexusai.app</span>
                  <span className="animate-pulse text-primary-400">_</span>
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-dark-800/50 bg-dark-900/30">
        <div className="container-custom py-12">
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

      {/* Services Preview */}
      <section className="section-padding relative">
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">What We Do</span>
              <h2 className="section-title mt-4">
                Services That <span className="gradient-text">Transform</span> Your Business
              </h2>
              <p className="section-subtitle mx-auto">
                End-to-end AI and development solutions tailored to your needs.
                From concept to deployment, we handle everything.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.slice(0, 8).map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.05}>
                <Link href={`/services#${service.id}`}>
                  <div className="glass-card-hover p-6 h-full group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <ServiceIcon name={service.icon} className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{service.shortTitle}</h3>
                    <p className="text-dark-400 text-sm leading-relaxed line-clamp-3">
                      {service.description}
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

      {/* Featured Projects */}
      <section className="section-padding relative bg-dark-900/30 border-y border-dark-800/50">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Our Work</span>
              <h2 className="section-title mt-4">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="section-subtitle mx-auto">
                Real solutions we&apos;ve built for real businesses. Each project showcases
                our expertise in AI, automation, and modern development.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 0.1}>
                <div className="glass-card-hover p-6 h-full group">
                  {/* Project Header */}
                  <div className={`w-full h-40 rounded-lg bg-gradient-to-br ${project.gradient} mb-5 flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2 opacity-60">
                        {project.category === 'AI Chatbots' && '🤖'}
                        {project.category === 'API Development' && '⚡'}
                        {project.category === 'E-Commerce' && '🛒'}
                        {project.category === 'AI Agents' && '🧠'}
                        {project.category === 'Web Scraping' && '🔍'}
                        {project.category === 'Chrome Extensions' && '🔧'}
                        {project.category === 'Full-Stack' && '💻'}
                      </div>
                      <span className="text-white/80 text-sm font-medium">{project.category}</span>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-dark-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-dark-800 text-dark-400 text-xs font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  {project.stats && (
                    <div className="flex gap-4 pt-4 border-t border-dark-800">
                      {project.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-primary-400 text-sm font-semibold">{stat.value}</div>
                          <div className="text-dark-500 text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center mt-12">
              <Link href="/portfolio" className="btn-secondary">
                View All Projects
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding relative">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-label">Testimonials</span>
              <h2 className="section-title mt-4">
                What Our <span className="gradient-text">Clients Say</span>
              </h2>
              <p className="section-subtitle mx-auto">
                Trusted by startups, agencies, and enterprises to deliver
                exceptional AI-powered solutions.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.slice(0, 6).map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.05}>
                <div className="glass-card p-6 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-5">
                    &quot;{t.content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-dark-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{t.name}</div>
                      <div className="text-dark-500 text-xs">{t.role}, {t.company}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden cta-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-dark-900 to-emerald-950 cta-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />

        <div className="relative container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Ready to Build Something{' '}
              <span className="gradient-text">Amazing</span>?
            </h2>
            <p className="text-dark-300 text-lg max-w-xl mx-auto mb-10">
              Let&apos;s discuss your project and find the perfect solution. Book a free
              consultation with our team today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">
                Book Free Consultation
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
