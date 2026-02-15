export interface Service {
  id: string
  title: string
  shortTitle: string
  description: string
  price: string
  originalPrice?: string
  features: string[]
  icon: string
  gradient: string
}

export const services: Service[] = [
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    shortTitle: 'AI Chatbot',
    description: 'Your AI assistant answers customer questions at 2am, captures their info, and texts you the lead. Never miss another call.',
    price: '$250 setup + $99/mo',
    originalPrice: '$500 setup + $99/mo',
    features: [
      'Answers customer questions 24/7',
      'Captures name, number, and job details',
      'Texts you new leads instantly',
      'Learns your services and pricing',
      'Works on your website or Facebook',
      'Monthly performance reports',
    ],
    icon: 'MessageSquare',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'website-ai-combo',
    title: 'Website + AI Combo',
    shortTitle: 'Website + AI',
    description: 'A professional website that makes you look legit online, plus a built-in AI chatbot that captures leads while you\'re on the job.',
    price: '$600 setup + $99/mo',
    originalPrice: '$1,200 setup + $99/mo',
    features: [
      'Modern, mobile-friendly website',
      'AI chatbot built right in',
      'Shows up on Google searches',
      'Photo gallery of your work',
      'Easy to update yourself',
      'Hosting and maintenance included',
    ],
    icon: 'Globe',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'booking-automation',
    title: 'Booking Automation',
    shortTitle: 'Booking',
    description: 'Stop playing phone tag. Customers book online, get automatic confirmations, and you get a clean schedule without the back-and-forth.',
    price: '$400–$1,000 one-time',
    originalPrice: '$800–$2,000 one-time',
    features: [
      'Online booking your customers can use',
      'Automatic confirmation texts and emails',
      'Follow-up reminders so nobody no-shows',
      'Connects to your calendar',
      'Simple invoicing after the job',
      'Works with QuickBooks and other tools',
    ],
    icon: 'Calendar',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'custom-solutions',
    title: 'Custom Solutions',
    shortTitle: 'Custom',
    description: 'Got a bigger problem? We\'ll figure out the right solution. CRM setup, dispatch systems, multi-location management — whatever you need.',
    price: 'Custom quote',
    features: [
      'We listen to your specific problem',
      'Custom-built to fit your workflow',
      'Integrates with your existing tools',
      'Training for you and your team',
      'Ongoing support included',
      'Scales as your business grows',
    ],
    icon: 'Settings',
    gradient: 'from-violet-500 to-purple-500',
  },
]
