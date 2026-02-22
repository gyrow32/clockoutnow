'use client'

import { useState, useEffect } from 'react'
import { CreateCampaignInput } from '@/lib/supabase-queries'

interface AddCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCampaignInput) => Promise<string | null>
}

export default function AddCampaignModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCampaignModalProps) {
  const [formData, setFormData] = useState<CreateCampaignInput>({
    business_name: '',
    contact: '',
    preview_page_slug: '',
    subject_line: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null)
  const [availableSlugs, setAvailableSlugs] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      // Fetch available preview page slugs
      fetch('/api/preview-pages')
        .then((r) => r.json())
        .then((pages) => setAvailableSlugs(pages.map((p: any) => p.slug)))
        .catch(() => {})
    }
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const url = await onSubmit(formData)
      if (url) {
        setTrackingUrl(url)
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setFormData({
      business_name: '',
      contact: '',
      preview_page_slug: '',
      subject_line: '',
      notes: '',
    })
    setTrackingUrl(null)
    onClose()
  }

  async function copyTrackingUrl() {
    if (trackingUrl) {
      await navigator.clipboard.writeText(trackingUrl)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {!trackingUrl ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-charcoal-100">
              <h2 className="text-xl font-bold text-charcoal-800">Log New Email</h2>
              <p className="text-sm text-charcoal-400 mt-1">
                Track a new campaign email sent to a lead
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) =>
                    setFormData({ ...formData, business_name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-charcoal-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-colors"
                  placeholder="Don's Roofing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">
                  Contact (Phone/Email) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-charcoal-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-colors"
                  placeholder="716-555-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">
                  Preview Page Slug *
                </label>
                {availableSlugs.length > 0 ? (
                  <select
                    required
                    value={formData.preview_page_slug}
                    onChange={(e) =>
                      setFormData({ ...formData, preview_page_slug: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-charcoal-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-colors"
                  >
                    <option value="">Select a preview page...</option>
                    {availableSlugs.map((slug) => (
                      <option key={slug} value={slug}>
                        {slug}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.preview_page_slug}
                    onChange={(e) =>
                      setFormData({ ...formData, preview_page_slug: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-charcoal-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-colors"
                    placeholder="dons-roofing"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={formData.subject_line}
                  onChange={(e) =>
                    setFormData({ ...formData, subject_line: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-charcoal-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-colors"
                  placeholder="Free website preview for Don's Roofing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-charcoal-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-colors resize-none"
                  placeholder="Initial outreach, found on Craigslist..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg border border-charcoal-200 text-charcoal-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charcoal-800 mb-2">
                Campaign Created!
              </h3>
              <p className="text-sm text-charcoal-400 mb-6">
                Copy the tracking URL below to use in your email
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-charcoal-500 mb-2 font-semibold">
                  Tracking URL
                </p>
                <code className="text-xs text-charcoal-800 break-all block mb-3">
                  {trackingUrl}
                </code>
                <button
                  onClick={copyTrackingUrl}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>

              <button
                onClick={handleClose}
                className="text-sm text-charcoal-500 hover:text-charcoal-700 font-medium"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
