import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'preview-pages')
  if (!fs.existsSync(dir)) return NextResponse.json([])

  const pages = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => {
      const slug = f.replace('.html', '')
      const html = fs.readFileSync(path.join(dir, f), 'utf-8')

      const titleMatch = html.match(/<title>(.*?)<\/title>/i)
      const rawTitle = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : slug

      const parts = rawTitle.split('|').map((p) => p.trim())
      const business = parts[0] || slug
      const location = parts[1] || ''

      return { slug, title: rawTitle, business, location }
    })
    .sort((a, b) => a.business.localeCompare(b.business))

  return NextResponse.json(pages)
}
