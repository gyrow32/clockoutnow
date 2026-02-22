import { NextResponse } from 'next/server'

export async function GET() {
  const adminKey = process.env.ADMIN_ACCESS_KEY || ''
  return NextResponse.json({
    admin_key_exists: !!process.env.ADMIN_ACCESS_KEY,
    admin_key_length: adminKey.length,
    admin_key_trimmed_length: adminKey.trim().length,
    has_whitespace: adminKey !== adminKey.trim(),
    expected_match: adminKey === 'buffalo2026',
    trimmed_match: adminKey.trim() === 'buffalo2026',
    first_char_code: adminKey.charCodeAt(0),
    last_char_code: adminKey.charCodeAt(adminKey.length - 1)
  })
}
