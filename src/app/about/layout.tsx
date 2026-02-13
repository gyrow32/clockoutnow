import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the Get Your Time Back team. Two builders passionate about AI, automation, and helping Buffalo-area small businesses save time.',
  openGraph: {
    title: 'About Us | Get Your Time Back',
    description:
      'Meet the team behind Get Your Time Back. AI and automation specialists helping small businesses save time.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
