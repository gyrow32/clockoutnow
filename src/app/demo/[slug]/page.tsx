import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'

// Demo data lives in a JSON file so we can add prospects without code changes
function getDemos(): Record<string, DemoData> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'demos.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

interface DemoData {
  businessName: string
  ownerName: string
  trade: string
  location: string
  phone?: string
  currentSite?: string
  services: string[]
  heroTagline: string
  chatPreview: { role: 'customer' | 'bot'; text: string }[]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const demos = getDemos()
  const demo = demos[slug]
  if (!demo) return { title: 'Demo Not Found' }
  return {
    title: `${demo.businessName} - Website & AI Demo | ClockOutNow`,
    description: `See what a professional website with AI chatbot could look like for ${demo.businessName}`,
    robots: { index: false, follow: false },
  }
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const demos = getDemos()
  const demo = demos[slug]
  if (!demo) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-green-600 text-white text-center py-3 px-4 text-sm">
        🎯 This is a free preview built by{' '}
        <a href="https://clockoutnow.com" className="underline font-semibold">
          ClockOutNow
        </a>{' '}
        for {demo.businessName}. Like what you see?{' '}
        <a href="https://clockoutnow.com/contact" className="underline font-semibold">
          Let&apos;s talk →
        </a>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-charcoal-800 to-charcoal-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {demo.businessName}
            </h1>
            <p className="text-xl text-gray-300 mb-2">{demo.heroTagline}</p>
            <p className="text-green-400 font-medium mb-8">
              📍 Serving {demo.location}
            </p>
            <div className="flex gap-4 flex-wrap">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                Get a Free Quote
              </button>
              <button className="border-2 border-white/30 hover:border-white text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                {demo.phone || 'Call Now'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {demo.services.map((service, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Preview */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your 24/7 AI Assistant
            </h2>
            <p className="text-gray-600 text-lg">
              Imagine — a customer visits your site at 11pm. Instead of leaving,
              they get instant answers.
            </p>
          </div>
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-green-600 text-white px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                💬
              </div>
              <div>
                <p className="font-semibold text-sm">{demo.businessName}</p>
                <p className="text-green-200 text-xs">Online now</p>
              </div>
            </div>
            <div className="p-5 space-y-4 min-h-[300px]">
              {demo.chatPreview.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'customer'
                        ? 'bg-green-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t px-4 py-3 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                disabled
              />
              <button className="bg-green-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm">
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {demo.ownerName ? `${demo.ownerName}, this` : 'This'} could be live
            in 48 hours.
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Professional website + AI chatbot that captures leads while you work.
            Launch pricing: <span className="line-through text-gray-400">$500</span>{' '}
            <span className="text-green-600 font-bold">$250 setup</span> + $99/mo.
            No contracts.
          </p>
          <a
            href="https://clockoutnow.com/contact"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Let&apos;s Build Yours →
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Built with ❤️ by ClockOutNow | Buffalo, NY
          </p>
        </div>
      </section>
    </div>
  )
}
