'use client'

import { useEffect, useState } from 'react'

interface SummaryCardsProps {
  totalSent: number
  responseRate: number
  totalViews: number
  totalPages: number
}

export default function SummaryCards({
  totalSent,
  responseRate,
  totalViews,
  totalPages,
}: SummaryCardsProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100)
  }, [])

  const cards = [
    {
      label: 'Emails Sent',
      value: totalSent,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-slate-700 to-slate-900',
      bgPattern: 'bg-slate-500/5',
      iconBg: 'bg-slate-500/10',
    },
    {
      label: 'Response Rate',
      value: `${responseRate}%`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: 'from-emerald-600 to-teal-700',
      bgPattern: 'bg-emerald-500/5',
      iconBg: 'bg-emerald-500/10',
    },
    {
      label: 'Page Views',
      value: totalViews,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: 'from-blue-600 to-cyan-700',
      bgPattern: 'bg-blue-500/5',
      iconBg: 'bg-blue-500/10',
    },
    {
      label: 'Preview Pages',
      value: totalPages,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-amber-600 to-orange-700',
      bgPattern: 'bg-amber-500/5',
      iconBg: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-[1px] transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          {/* Glass morphism card */}
          <div className="relative h-full bg-white/95 backdrop-blur-xl rounded-2xl p-6 overflow-hidden">
            {/* Background pattern */}
            <div className={`absolute inset-0 ${card.bgPattern} opacity-50`}>
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px',
                opacity: 0.1
              }} />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-xl ${card.iconBg} mb-4 text-white bg-gradient-to-br ${card.gradient}`}>
                {card.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-1 transition-all duration-300 group-hover:scale-110 origin-left">
                {card.value}
              </div>
              <div className="text-sm font-medium text-charcoal-500 uppercase tracking-wide">
                {card.label}
              </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>
      ))}
    </div>
  )
}
