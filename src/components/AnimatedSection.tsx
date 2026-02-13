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
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { rootMargin: '-80px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // SSR: fully visible. Client: animate on scroll.
  const shouldAnimate = mounted && !isVisible

  return (
    <div
      ref={ref}
      className={className}
      style={
        shouldAnimate
          ? {
              opacity: 0,
              transform: 'translateY(30px)',
              transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
            }
          : mounted && isVisible
          ? {
              opacity: 1,
              transform: 'translateY(0)',
              transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
