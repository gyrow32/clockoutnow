import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the NexusAI team. Two builders passionate about AI, automation, and modern web development. Learn about our mission, values, and expertise.',
  openGraph: {
    title: 'About Us | NexusAI',
    description:
      'Meet the team behind NexusAI. AI specialists and full-stack developers building intelligent solutions.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
