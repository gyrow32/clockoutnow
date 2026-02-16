import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preview Pages',
  description: 'Custom landing page previews built for local businesses.',
  robots: { index: false, follow: false },
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
