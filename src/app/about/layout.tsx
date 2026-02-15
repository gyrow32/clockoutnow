import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the ClockOutNow team. We build AI tools for contractors and service businesses in Western New York.',
  openGraph: {
    title: 'About Us | ClockOutNow',
    description:
      'We build AI chatbots, websites, and booking systems for contractors and service businesses.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
