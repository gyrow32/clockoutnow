import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Portal | ClockOut Now',
  description: 'Manage your gallery images',
  robots: 'noindex, nofollow',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children
}
