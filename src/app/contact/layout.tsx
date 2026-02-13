import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Book a Call',
  description:
    'Book a free consultation with Get Your Time Back. Tell us about your biggest business headache and we\'ll propose a solution.',
  openGraph: {
    title: 'Contact | Get Your Time Back',
    description:
      'Book a free consultation. We respond within 24 hours. No tech jargon, we speak plain English.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
