import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'AI chatbots, professional websites, and booking automation for contractors and service businesses. Simple tools that get you more jobs.',
  openGraph: {
    title: 'Services | ClockOutNow',
    description:
      'AI chatbots, websites, and booking systems for contractors. Simple, affordable, effective.',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
