import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get a free consultation with ClockOutNow. Tell us about your business and we\'ll show you how AI can help.',
  openGraph: {
    title: 'Contact | ClockOutNow',
    description:
      'Free consultation for contractors and service businesses. We respond within 24 hours.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
