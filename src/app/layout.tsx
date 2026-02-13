import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://getyourtimeback.com'),
  title: {
    default: 'Get Your Time Back | AI Automation for Small Businesses',
    template: '%s | Get Your Time Back',
  },
  description:
    'Custom AI chatbots, workflow automation, and web solutions for Buffalo-area small businesses. Stop grinding, start growing. Free consultation.',
  keywords: [
    'AI automation Buffalo',
    'small business automation',
    'AI chatbot for contractors',
    'workflow automation Buffalo NY',
    'small business AI tools',
    'HVAC automation',
    'contractor website',
    'local business AI',
  ],
  authors: [{ name: 'Get Your Time Back' }],
  creator: 'Get Your Time Back',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://getyourtimeback.com',
    siteName: 'Get Your Time Back',
    title: 'Get Your Time Back | AI Automation for Small Businesses',
    description:
      'Custom AI chatbots, workflow automation, and web solutions for Buffalo-area small businesses. Stop grinding, start growing.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Get Your Time Back - Small Business Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Your Time Back | AI Automation for Small Businesses',
    description:
      'Custom AI chatbots, workflow automation, and web solutions for Buffalo-area small businesses.',
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
  name: 'Get Your Time Back',
  description:
    'AI automation agency helping Buffalo-area small businesses save time with custom chatbots, workflow automation, and web development.',
  url: 'https://getyourtimeback.com',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: { '@type': 'GeoCoordinates', latitude: 42.8864, longitude: -78.8784 },
    geoRadius: '150',
  },
  serviceType: [
    'AI Chatbot Development',
    'Workflow Automation',
    'Website Development',
    'Web Scraping',
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
