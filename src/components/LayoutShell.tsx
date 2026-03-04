'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

const HIDDEN_PREFIXES = ['/admin', '/portal', '/preview', '/client-site']

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hide = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))

  return (
    <>
      {!hide && <Navbar />}
      <main id="main-content" className="flex-1">{children}</main>
      {!hide && <Footer />}
    </>
  )
}
