'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import { projects, categories } from '@/data/projects'

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="relative container-custom">
          <AnimatedSection>
            <span className="section-label">Our Portfolio</span>
            <h1 className="section-title mt-4 max-w-3xl">
              Projects That <span className="gradient-text">Deliver Results</span>
            </h1>
            <p className="section-subtitle mt-4 max-w-2xl">
              Real solutions built for real businesses. Every project showcases our commitment
              to quality, performance, and innovation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-8">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-800/50 text-dark-400 border border-dark-700/50 hover:text-white hover:border-dark-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-card-hover p-6 h-full group">
                    {/* Header */}
                    <div className={`w-full h-44 rounded-lg bg-gradient-to-br ${project.gradient} mb-5 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 grid-pattern opacity-50" />
                      <div className="relative text-center">
                        <div className="text-5xl mb-2 opacity-60">
                          {project.category === 'AI Chatbots' && '🤖'}
                          {project.category === 'AI Agents' && '🧠'}
                          {project.category === 'API Development' && '⚡'}
                          {project.category === 'E-Commerce' && '🛒'}
                          {project.category === 'Web Scraping' && '🔍'}
                          {project.category === 'Chrome Extensions' && '🔧'}
                          {project.category === 'Full-Stack' && '💻'}
                        </div>
                        <span className="text-white/80 text-sm font-medium">{project.category}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-white font-semibold text-xl mb-3 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed mb-4">
                      {project.longDescription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-dark-800 text-dark-400 text-xs font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    {project.stats && (
                      <div className="flex gap-6 pt-4 border-t border-dark-800">
                        {project.stats.map((stat) => (
                          <div key={stat.label}>
                            <div className="text-primary-400 font-semibold">{stat.value}</div>
                            <div className="text-dark-500 text-xs">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden border-t border-dark-800/50 cta-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-dark-900 to-emerald-950 cta-bg" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
              Want Your Project on This List?
            </h2>
            <p className="text-dark-300 text-lg max-w-xl mx-auto mb-10">
              We&apos;d love to bring your vision to life. Let&apos;s build something amazing together.
            </p>
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Start Your Project
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
