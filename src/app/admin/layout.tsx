import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | ClockOut Now',
  description: 'Campaign tracking and analytics dashboard',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
