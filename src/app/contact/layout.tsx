import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Book a Call',
  description:
    'Book a free consultation with NexusAI. Get a detailed proposal for your AI chatbot, automation, API integration, or web development project.',
  openGraph: {
    title: 'Contact & Book a Call | NexusAI',
    description:
      'Book a free consultation for your AI or development project. We respond within 24 hours.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
