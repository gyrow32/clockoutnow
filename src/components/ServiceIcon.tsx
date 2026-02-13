'use client'

interface ServiceIconProps {
  name: string
  className?: string
}

export default function ServiceIcon({ name, className = 'w-6 h-6' }: ServiceIconProps) {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'MessageSquare':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'Brain':
      return (
        <svg {...props}>
          <path d="M12 2a6 6 0 0 0-6 6c0 1.5.6 2.8 1.5 3.8L12 17l4.5-5.2A6 6 0 0 0 12 2z" />
          <path d="M12 17v5" />
          <path d="M9 8h.01" />
          <path d="M15 8h.01" />
          <path d="M10 12h4" />
        </svg>
      )
    case 'Workflow':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="3" width="6" height="6" rx="1" />
          <rect x="9" y="15" width="6" height="6" rx="1" />
          <path d="M6 9v3a1 1 0 0 0 1 1h4" />
          <path d="M18 9v3a1 1 0 0 1-1 1h-4" />
          <path d="M12 13v2" />
        </svg>
      )
    case 'Plug':
      return (
        <svg {...props}>
          <path d="M12 22v-5" />
          <path d="M9 8V2" />
          <path d="M15 8V2" />
          <path d="M18 8v5a6 6 0 0 1-12 0V8z" />
        </svg>
      )
    case 'Globe':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      )
    case 'Search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      )
    case 'Chrome':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <path d="M21.17 8H12" />
          <path d="m3.95 6.06 4.5 7.79" />
          <path d="M10.88 21.94l4.5-7.79" />
        </svg>
      )
    case 'ShoppingCart':
      return (
        <svg {...props}>
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
  }
}
