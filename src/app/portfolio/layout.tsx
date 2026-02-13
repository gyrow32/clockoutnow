import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Explore our portfolio of AI chatbots, automation systems, API platforms, web scrapers, Chrome extensions, and full-stack applications built for real businesses.',
  openGraph: {
    title: 'Portfolio | NexusAI',
    description:
      'Real AI and development projects delivered for real businesses. Chatbots, automation, APIs, and more.',
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children
}
