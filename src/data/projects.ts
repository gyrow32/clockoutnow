export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  category: string
  image: string
  gradient: string
  stats?: { label: string; value: string }[]
}

export const projects: Project[] = [
  {
    id: 'carrier-chatbot',
    title: 'Carrier AI Chatbot',
    description: 'RAG-powered AI chatbot with real-time streaming, Google Docs knowledge base integration, and embeddable widget deployment.',
    longDescription: 'Built a production-ready AI chatbot system with Retrieval-Augmented Generation (RAG) capabilities. The system indexes Google Docs as a knowledge base, generates embeddings for semantic search, and delivers real-time streaming responses. Deployed as both a full-page application and an embeddable widget for seamless integration into any website.',
    tags: ['OpenAI API', 'RAG', 'Node.js', 'Express', 'Embeddings', 'Vercel'],
    category: 'AI Chatbots',
    image: '/projects/chatbot.svg',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    stats: [
      { label: 'Response Time', value: '<2s' },
      { label: 'Knowledge Sources', value: '50+' },
      { label: 'Daily Queries', value: '1K+' },
    ],
  },
  {
    id: 'knowledge-chatbot',
    title: 'Enterprise Knowledge Bot',
    description: 'Full-stack AI chatbot with pgvector semantic search, session management, Redis caching, and admin dashboard.',
    longDescription: 'Developed a comprehensive enterprise knowledge chatbot using FastAPI, React, and Supabase pgvector for vector similarity search. Features include persistent conversation sessions, Redis-powered caching for fast responses, real-time streaming, and a full admin API for managing knowledge bases and monitoring usage.',
    tags: ['FastAPI', 'React', 'Supabase', 'pgvector', 'Redis', 'OpenAI'],
    category: 'AI Chatbots',
    image: '/projects/knowledge-bot.svg',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    stats: [
      { label: 'Vector DB', value: 'pgvector' },
      { label: 'Cache Hit Rate', value: '85%' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    id: 'car-api-platform',
    title: 'Vehicle Inventory AI Platform',
    description: 'Multi-service vehicle API platform with AI chatbot search, MCP integration, financing calculations, and dealer tools.',
    longDescription: 'Architected a comprehensive vehicle inventory platform spanning multiple implementations: REST APIs for vehicle search and scoring, an AI-powered chatbot using Model Context Protocol (MCP) for intelligent vehicle queries, financing and profit calculators, and integration with LenderDesk APIs. Deployed across AWS Lightsail with C# and Node.js backends.',
    tags: ['Python', 'C#', 'Node.js', 'MCP', 'Flask', 'AWS', 'Supabase'],
    category: 'API Development',
    image: '/projects/car-api.svg',
    gradient: 'from-amber-500/20 to-orange-500/20',
    stats: [
      { label: 'API Endpoints', value: '30+' },
      { label: 'Vehicle Records', value: '50K+' },
      { label: 'Implementations', value: '6' },
    ],
  },
  {
    id: 'elady-shopify',
    title: 'eLady Shopify Dropship Sync',
    description: 'Automated dropshipping system syncing 194MB+ inventory between eLady marketplace and Shopify with real-time updates.',
    longDescription: 'Built an enterprise-grade dropshipping management system that continuously syncs inventory between the eLady marketplace and Shopify. Features include bulk item fetching, real-time inventory synchronization, CSV batch processing, automated scheduling, and a comprehensive web UI. Handles a 194MB+ product database with reliable sync operations.',
    tags: ['Python', 'Flask', 'Shopify API', 'SQLite', 'Render', 'Cron'],
    category: 'E-Commerce',
    image: '/projects/shopify.svg',
    gradient: 'from-green-500/20 to-emerald-500/20',
    stats: [
      { label: 'Products Synced', value: '10K+' },
      { label: 'Database Size', value: '194MB' },
      { label: 'Sync Frequency', value: 'Real-time' },
    ],
  },
  {
    id: 'universal-scraper',
    title: 'Universal AI Scraper',
    description: 'Intelligent web scraping platform with multi-AI support (OpenAI, Google, Groq), Streamlit UI, and configurable extraction.',
    longDescription: 'Developed a versatile web scraping tool powered by AI for intelligent data extraction. Supports multiple AI providers (OpenAI, Google Gemini, Groq) for smart parsing, features a Streamlit-based user interface for easy configuration, and handles complex scraping scenarios with Selenium for dynamic content. Output formats include CSV, JSON, and direct database storage.',
    tags: ['Python', 'Selenium', 'Streamlit', 'OpenAI', 'Groq', 'Google AI'],
    category: 'Web Scraping',
    image: '/projects/scraper.svg',
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    stats: [
      { label: 'AI Providers', value: '3' },
      { label: 'Sites Supported', value: 'Any' },
      { label: 'Export Formats', value: '5+' },
    ],
  },
  {
    id: 'revue-extension',
    title: 'Revue CRM Chrome Extension',
    description: 'Multi-platform Chrome extension integrating with VinSolutions, AutoLoop, XTime, and Tekion dealer CRM systems.',
    longDescription: 'Created a sophisticated Chrome extension (Manifest V3) for the automotive industry that injects referral buttons and interactive UI elements directly into major dealership CRM platforms. Integrates with VinSolutions (Cox Auto), AutoLoop messaging, XTime scheduling, Darwin Automotive, and Tekion Cloud. Uses content scripts for seamless DOM injection.',
    tags: ['Chrome Extension', 'Manifest V3', 'JavaScript', 'CRM', 'DOM Injection'],
    category: 'Chrome Extensions',
    image: '/projects/extension.svg',
    gradient: 'from-teal-500/20 to-cyan-500/20',
    stats: [
      { label: 'CRM Platforms', value: '5' },
      { label: 'Active Users', value: '200+' },
      { label: 'Manifest', value: 'V3' },
    ],
  },
  {
    id: 'inventory-management',
    title: 'Market Inventory System',
    description: '10,000+ line enterprise inventory management with POS, customer ledger, invoicing, and multi-user authentication.',
    longDescription: 'Built a comprehensive desktop inventory management system spanning 10,639+ lines of code with 322+ methods across 15 business domains. Features include product management, point-of-sale, customer and supplier management, Khata ledger system, invoice generation, financial reporting, and multi-user PIN authentication. Currently being refactored from monolithic to modular architecture.',
    tags: ['Python', 'Tkinter', 'JSON Storage', 'PDF Generation', 'Desktop App'],
    category: 'Full-Stack',
    image: '/projects/inventory.svg',
    gradient: 'from-rose-500/20 to-pink-500/20',
    stats: [
      { label: 'Lines of Code', value: '10K+' },
      { label: 'Business Modules', value: '15' },
      { label: 'Methods', value: '322' },
    ],
  },
  {
    id: 'agentic-chat-app',
    title: 'AI Agent Chat Platform',
    description: 'Multi-agent chat application with autonomous task execution, tool integration, and intelligent conversation management.',
    longDescription: 'Developed a cutting-edge AI agent chat platform that leverages autonomous agents for complex task execution. Features multi-agent orchestration, real-time tool calling, and intelligent conversation management. The platform enables AI agents to interact with external tools and APIs while maintaining coherent, context-aware conversations.',
    tags: ['Python', 'OpenAI', 'Agent SDK', 'WebSocket', 'React', 'MCP'],
    category: 'AI Agents',
    image: '/projects/agent.svg',
    gradient: 'from-indigo-500/20 to-blue-500/20',
    stats: [
      { label: 'Agent Types', value: '4+' },
      { label: 'Tool Integrations', value: '10+' },
      { label: 'Architecture', value: 'Multi-Agent' },
    ],
  },
]

export const categories = [
  'All',
  'AI Chatbots',
  'AI Agents',
  'API Development',
  'E-Commerce',
  'Web Scraping',
  'Chrome Extensions',
  'Full-Stack',
]
