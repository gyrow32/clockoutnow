import { NextRequest } from 'next/server'

/**
 * Verify client portal auth from Authorization header.
 * Key is read from env var CLIENT_PORTAL_KEY_{SLUG_UPPER}.
 */
export function verifyClientAuth(req: NextRequest, slug: string): boolean {
  const envKey = `CLIENT_PORTAL_KEY_${slug.toUpperCase().replace(/-/g, '_')}`
  const expectedKey = process.env[envKey]?.trim()
  if (!expectedKey) return false

  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false

  const token = authHeader.replace('Bearer ', '').trim()
  return token === expectedKey
}
