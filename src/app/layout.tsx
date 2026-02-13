import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://nexusai.vercel.app'),
  title: {
    default: 'NexusAI | AI Chatbots, Automation & Web Development Agency',
    template: '%s | NexusAI',
  },
  description:
    'Expert AI solutions agency specializing in custom chatbots, intelligent automation, API integrations, web scraping, Chrome extensions, and full-stack web development. Transform your business with cutting-edge AI technology.',
  keywords: [
    'AI chatbot development',
    'AI automation agency',
    'custom chatbot builder',
    'n8n workflow automation',
    'API integration services',
    'web scraping services',
    'Chrome extension development',
    'full stack web development',
    'AI agent development',
    'RAG chatbot',
    'OpenAI integration',
    'Shopify automation',
    'business process automation',
    'AI consulting',
    'bot development',
    'MCP integration',
    'Next.js development',
    'Python development',
    'Node.js development',
    'freelance AI developer',
  ],
  authors: [
    { name: 'NexusAI', url: 'https://nexusai.vercel.app' },
  ],
  creator: 'NexusAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexusai.vercel.app',
    siteName: 'NexusAI',
    title: 'NexusAI | AI Chatbots, Automation & Web Development Agency',
    description:
      'Expert AI solutions agency specializing in custom chatbots, intelligent automation, API integrations, and full-stack web development.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NexusAI - AI Solutions Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusAI | AI Chatbots, Automation & Web Development Agency',
    description:
      'Expert AI solutions agency specializing in custom chatbots, intelligent automation, and full-stack web development.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'NexusAI',
  description: 'AI solutions agency specializing in chatbots, automation, API integration, and web development.',
  url: 'https://nexusai.vercel.app',
  email: ['abuzarmirza918@gmail.com', 'gyrow32@gmail.com'],
  sameAs: [
    'https://github.com/abuzar355',
    'https://www.freelancer.com/u/Abuzar00',
  ],
  serviceType: [
    'AI Chatbot Development',
    'Workflow Automation',
    'API Integration',
    'Web Development',
    'Web Scraping',
    'Chrome Extension Development',
  ],
  areaServed: 'Worldwide',
  founder: [
    { '@type': 'Person', name: 'Abuzar Mirza' },
    { '@type': 'Person', name: 'Mike' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('nexusai-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
