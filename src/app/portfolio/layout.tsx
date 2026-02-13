import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Explore our portfolio of AI chatbots, automation systems, websites, and custom solutions built for real small businesses.',
  openGraph: {
    title: 'Portfolio | Get Your Time Back',
    description:
      'Real AI and automation projects delivered for real small businesses. See what we can build for you.',
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children
}
