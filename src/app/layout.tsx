import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://clockoutnow.com'),
  title: {
    default: 'ClockOutNow | AI Automation for Contractors & Service Businesses',
    template: '%s | ClockOutNow',
  },
  description:
    'AI chatbots, websites, and booking automation for plumbers, roofers, HVAC techs, and service businesses. Stop losing leads to missed calls. Based in Western New York.',
  keywords: [
    'AI for contractors',
    'contractor chatbot',
    'HVAC automation',
    'plumber website',
    'roofer lead generation',
    'service business automation',
    'AI chatbot for small business',
    'contractor booking system',
    'Western New York',
    'Buffalo AI services',
    'Buffalo contractor website',
    'WNY small business automation',
  ],
  authors: [{ name: 'ClockOutNow' }],
  creator: 'ClockOutNow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clockoutnow.com',
    siteName: 'ClockOutNow',
    title: 'ClockOutNow | AI Automation for Contractors & Service Businesses',
    description:
      'AI chatbots, websites, and booking automation for plumbers, roofers, HVAC techs, and service businesses. Stop losing leads to missed calls.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClockOutNow - AI Automation for Contractors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClockOutNow | AI Automation for Contractors',
    description:
      'AI chatbots, websites, and booking automation for service businesses. Stop losing leads to missed calls.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ClockOutNow',
  description:
    'AI automation for contractors and service businesses. Chatbots, websites, and booking systems that help you stop missing calls and start growing.',
  url: 'https://clockoutnow.com',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: { '@type': 'GeoCoordinates', latitude: 42.8864, longitude: -78.8784 },
    geoRadius: '150',
  },
  serviceType: [
    'AI Chatbot',
    'Website Development',
    'Booking Automation',
    'Business Automation',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
