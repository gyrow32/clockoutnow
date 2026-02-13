export interface Service {
  id: string
  title: string
  shortTitle: string
  description: string
  features: string[]
  icon: string
  gradient: string
}

export const services: Service[] = [
  {
    id: 'ai-chatbots',
    title: 'AI Chatbot Development',
    shortTitle: 'AI Chatbots',
    description: 'Custom AI-powered chatbots with RAG, streaming responses, and seamless integration into your existing platforms. Built with OpenAI, LangChain, and custom agent frameworks.',
    features: [
      'RAG-powered knowledge chatbots',
      'Real-time streaming responses',
      'Multi-platform deployment',
      'Custom training & fine-tuning',
      'Embeddable chat widgets',
      'Conversation analytics',
    ],
    icon: 'MessageSquare',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'ai-agents',
    title: 'AI Agent Development',
    shortTitle: 'AI Agents',
    description: 'Intelligent AI agents that autonomously perform complex tasks, make decisions, and integrate with your tools using MCP, function calling, and multi-agent orchestration.',
    features: [
      'Autonomous task execution',
      'Multi-agent systems',
      'Tool & API integration (MCP)',
      'Decision-making pipelines',
      'Custom agent frameworks',
      'Human-in-the-loop workflows',
    ],
    icon: 'Brain',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    shortTitle: 'Automation',
    description: 'End-to-end business process automation using n8n, custom scripts, and AI-powered workflows. Eliminate repetitive tasks and scale your operations.',
    features: [
      'n8n workflow design',
      'Custom automation scripts',
      'Data pipeline automation',
      'Scheduled task management',
      'Error handling & monitoring',
      'Multi-system orchestration',
    ],
    icon: 'Workflow',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'api-integration',
    title: 'API Integration & Development',
    shortTitle: 'API Integration',
    description: 'Robust API development and third-party integrations connecting your systems seamlessly. REST, GraphQL, WebSocket, and real-time data sync solutions.',
    features: [
      'Custom REST & GraphQL APIs',
      'Third-party API integration',
      'Real-time WebSocket systems',
      'Data sync & ETL pipelines',
      'API documentation & testing',
      'Scalable microservices',
    ],
    icon: 'Plug',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 'web-development',
    title: 'Full-Stack Web Development',
    shortTitle: 'Web Dev',
    description: 'Modern, responsive web applications built with Next.js, React, Python, and Node.js. From landing pages to complex SaaS platforms and dashboards.',
    features: [
      'Next.js & React applications',
      'Python Flask/FastAPI backends',
      'Responsive & mobile-first UI',
      'Database design & optimization',
      'Authentication & security',
      'Vercel & cloud deployment',
    ],
    icon: 'Globe',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'web-scraping',
    title: 'Web Scraping & Data Extraction',
    shortTitle: 'Web Scraping',
    description: 'Intelligent web scraping solutions with anti-detection, AI-powered data parsing, and automated extraction pipelines for any website or platform.',
    features: [
      'Selenium & Playwright automation',
      'Anti-detection & stealth scraping',
      'AI-powered data parsing',
      'Scheduled extraction pipelines',
      'CSV/JSON/Database export',
      'Real-time monitoring dashboards',
    ],
    icon: 'Search',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'chrome-extensions',
    title: 'Chrome Extension Development',
    shortTitle: 'Extensions',
    description: 'Custom Chrome extensions with Manifest V3, content scripts, background workers, and seamless integration with web platforms and CRM systems.',
    features: [
      'Manifest V3 extensions',
      'Content script injection',
      'Background service workers',
      'CRM & platform integration',
      'Popup & sidebar UIs',
      'Chrome Web Store publishing',
    ],
    icon: 'Chrome',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce & Shopify Solutions',
    shortTitle: 'E-Commerce',
    description: 'Shopify integrations, inventory management systems, and dropshipping automation. Complete e-commerce solutions from product sync to order fulfillment.',
    features: [
      'Shopify app development',
      'Inventory sync automation',
      'Dropshipping management',
      'Product data pipelines',
      'Order fulfillment workflows',
      'Analytics & reporting',
    ],
    icon: 'ShoppingCart',
    gradient: 'from-green-500 to-emerald-500',
  },
]
