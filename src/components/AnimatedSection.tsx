'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({
  children,
  className = '',
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Start visible to avoid flash — only hide once we confirm element is below fold
  const [state, setState] = useState<'initial' | 'hidden' | 'visible'>('initial')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    // Already in viewport — keep visible, done
    if (rect.top < window.innerHeight + 100) {
      setState('visible')
      return
    }

    // Below fold — hide and wait for scroll
    setState('hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: React.CSSProperties =
    state === 'hidden'
      ? { opacity: 0, transform: 'translateY(24px)' }
      : state === 'visible'
      ? { opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }
      : {} // 'initial' — no inline style, fully visible by default

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
