import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'AI Chatbots, Workflow Automation, Website + AI Combos, Web Scraping, and Custom Development for Buffalo-area small businesses.',
  openGraph: {
    title: 'Services | Get Your Time Back',
    description:
      'AI automation services for small businesses — chatbots, workflow automation, web development, and more.',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
