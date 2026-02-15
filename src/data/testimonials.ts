export interface Scenario {
  id: string
  title: string
  industry: string
  problem: string
  result: string
  icon: string
}

export const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'The HVAC Company That Stopped Losing Midnight Calls',
    industry: 'HVAC',
    problem: 'Emergency calls at 2am were going to voicemail. By morning, the customer had already called someone else.',
    result: 'An AI chatbot now answers instantly, captures the job details, and texts the on-call tech. No more lost emergency jobs.',
    icon: '❄️',
  },
  {
    id: '2',
    title: 'The Cleaning Service That Automated Booking',
    industry: 'Cleaning',
    problem: 'The owner spent 2 hours every evening returning calls and scheduling jobs. Weekends were worse.',
    result: 'Customers now book online, get automatic confirmations, and the schedule fills itself. She got her evenings back.',
    icon: '🧹',
  },
  {
    id: '3',
    title: 'The Roofer Who Got Found on Google',
    industry: 'Roofing',
    problem: 'Great work, zero web presence. All leads came from word of mouth and Craigslist. Growth had flatlined.',
    result: 'A professional website with AI chat started pulling in 15+ leads per month from Google. Revenue up 40% in 6 months.',
    icon: '🏠',
  },
  {
    id: '4',
    title: 'The Plumber Who Stopped Playing Phone Tag',
    industry: 'Plumbing',
    problem: 'Missed calls on the job site, forgot to call back, lost the lead. Repeat daily.',
    result: 'AI captures every inquiry with details. Follow-up texts go out automatically. Close rate doubled.',
    icon: '🔧',
  },
]
