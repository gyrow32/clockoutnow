/**
 * Analytics utility functions for campaign tracking
 */

import { Campaign } from './supabase-queries'

/**
 * Generate a tracking URL for a campaign
 */
export function generateTrackingUrl(
  slug: string,
  campaignId: string,
  baseUrl = 'https://clockoutnow.com'
): string {
  const params = new URLSearchParams({
    utm_source: 'email',
    utm_campaign: campaignId,
  })
  return `${baseUrl}/preview/${slug}?${params.toString()}`
}

/**
 * Get status badge color
 */
export function getStatusColor(
  status: Campaign['status']
): { bg: string; text: string; label: string; emoji: string } {
  switch (status) {
    case 'NEW':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        label: 'New',
        emoji: '🔵',
      }
    case 'CONTACTED':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        label: 'Contacted',
        emoji: '🟡',
      }
    case 'REPLIED':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Replied',
        emoji: '🟢',
      }
    case 'CLOSED':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        label: 'Closed',
        emoji: '⚪',
      }
  }
}

/**
 * Format date for display
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  // Format as MM/DD
  return `${date.getMonth() + 1}/${date.getDate()}`
}

/**
 * Format contact info (phone/email) for display
 */
export function formatContact(contact: string): string {
  // If it looks like a phone number, format it
  const cleaned = contact.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return contact
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

/**
 * Validate preview page slug exists
 */
export async function validatePreviewSlug(slug: string): Promise<boolean> {
  try {
    const res = await fetch('/api/preview-pages')
    const pages = await res.json()
    return pages.some((p: { slug: string }) => p.slug === slug)
  } catch {
    return false
  }
}
