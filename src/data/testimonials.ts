export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
  service: string
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'James Richardson',
    role: 'CTO',
    company: 'AutoDeal Pro',
    content: 'They built us a vehicle inventory API platform that completely transformed our dealer operations. The AI chatbot integration lets our customers search inventory naturally. Response times dropped by 80% and customer satisfaction skyrocketed.',
    rating: 5,
    avatar: 'JR',
    service: 'API Integration',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Operations Director',
    company: 'LuxeDropship',
    content: 'The Shopify integration they built syncs our entire 10,000+ product catalog in real-time. What used to take our team hours of manual work now runs automatically. Our inventory accuracy went from 85% to 99.9%.',
    rating: 5,
    avatar: 'SC',
    service: 'E-Commerce',
  },
  {
    id: '3',
    name: 'Marcus Thompson',
    role: 'Founder',
    company: 'DataPulse Analytics',
    content: 'The universal scraper they developed handles websites that no other tool could crack. The AI-powered parsing is incredibly accurate and the Streamlit dashboard makes it easy for our non-technical team to use.',
    rating: 5,
    avatar: 'MT',
    service: 'Web Scraping',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    role: 'Head of Customer Success',
    company: 'TechFlow SaaS',
    content: 'Our AI chatbot handles 70% of customer queries without human intervention now. The RAG implementation is spot-on, pulling relevant answers from our documentation instantly. Setup was seamless and support has been outstanding.',
    rating: 5,
    avatar: 'ER',
    service: 'AI Chatbots',
  },
  {
    id: '5',
    name: 'David Park',
    role: 'VP Engineering',
    company: 'Revue Insurance',
    content: 'The Chrome extension they built integrates perfectly with five different CRM platforms. Our agents save 30 minutes per customer interaction. The DOM injection approach is incredibly smooth and our clients love the seamless experience.',
    rating: 5,
    avatar: 'DP',
    service: 'Chrome Extensions',
  },
  {
    id: '6',
    name: 'Aisha Patel',
    role: 'CEO',
    company: 'NovaByte Solutions',
    content: 'They automated our entire onboarding workflow using n8n and custom scripts. What took 3 days of manual processing now completes in 2 hours. The ROI was visible within the first month. Truly exceptional work.',
    rating: 5,
    avatar: 'AP',
    service: 'Automation',
  },
  {
    id: '7',
    name: 'Robert Kimball',
    role: 'Product Manager',
    company: 'FinEdge Capital',
    content: 'The AI agent platform they developed handles complex financial data analysis autonomously. It integrates with our existing tools via MCP and has reduced our analysis time by 60%. The multi-agent architecture is impressive.',
    rating: 5,
    avatar: 'RK',
    service: 'AI Agents',
  },
  {
    id: '8',
    name: 'Lisa Nakamura',
    role: 'Digital Director',
    company: 'Meridian Retail',
    content: 'From the initial consultation to deployment, the entire experience was professional and efficient. Our new web platform loads in under 2 seconds and has increased our conversion rate by 40%. Highly recommended.',
    rating: 5,
    avatar: 'LN',
    service: 'Web Development',
  },
]
