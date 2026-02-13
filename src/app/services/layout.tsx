import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'AI Chatbot Development, Workflow Automation, API Integration, Web Scraping, Chrome Extensions, Full-Stack Web Development, and E-Commerce Solutions. Expert AI and development services.',
  openGraph: {
    title: 'Services | NexusAI',
    description:
      'Full-spectrum AI and development services including chatbots, automation, API integration, and web development.',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
