'use client'

import { useState } from 'react'
import { Campaign } from '@/lib/supabase-queries'
import { getStatusColor, formatDate, formatContact, copyToClipboard } from '@/lib/analytics'

interface CampaignTableProps {
  campaigns: Campaign[]
  onUpdate: (id: string, status: Campaign['status']) => Promise<void>
  onRefresh: () => void
}

export default function CampaignTable({
  campaigns,
  onUpdate,
  onRefresh,
}: CampaignTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleMarkReplied(id: string) {
    setUpdatingId(id)
    try {
      await onUpdate(id, 'REPLIED')
      onRefresh()
    } catch (error) {
      console.error('Failed to update campaign:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleCopyLink(slug: string, id: string) {
    const url = `https://clockoutnow.com/preview/${slug}?utm_source=email&utm_campaign=${id}`
    const success = await copyToClipboard(url)
    if (success) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-charcoal-100 p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-charcoal-800 mb-2">
          No campaigns yet
        </h3>
        <p className="text-charcoal-400 text-sm">
          Click "Log New Email" to get started
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-charcoal-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-charcoal-100">
        <h2 className="text-lg font-semibold text-charcoal-800">Campaign Timeline</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-charcoal-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {campaigns.map((campaign) => {
              const statusInfo = getStatusColor(campaign.status)
              const isExpanded = expandedId === campaign.id

              return (
                <>
                  <tr
                    key={campaign.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : campaign.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-600">
                      {formatDate(campaign.sent_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-charcoal-800">
                        {campaign.business_name}
                      </div>
                      <div className="text-xs text-charcoal-400">
                        {campaign.preview_page_slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-600">
                      {formatContact(campaign.contact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                      >
                        <span>{statusInfo.emoji}</span>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`/preview/${campaign.preview_page_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View
                        </a>
                        {campaign.status === 'CONTACTED' && (
                          <button
                            onClick={() => handleMarkReplied(campaign.id)}
                            disabled={updatingId === campaign.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            {updatingId === campaign.id ? '...' : 'Mark Replied'}
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyLink(campaign.preview_page_slug, campaign.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {copiedId === campaign.id ? '✓ Copied' : 'Copy Link'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded row with details */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3 text-sm">
                          {campaign.subject_line && (
                            <div>
                              <span className="font-semibold text-charcoal-700">Subject:</span>{' '}
                              <span className="text-charcoal-600">{campaign.subject_line}</span>
                            </div>
                          )}
                          {campaign.notes && (
                            <div>
                              <span className="font-semibold text-charcoal-700">Notes:</span>{' '}
                              <span className="text-charcoal-600">{campaign.notes}</span>
                            </div>
                          )}
                          {campaign.response_notes && (
                            <div>
                              <span className="font-semibold text-charcoal-700">Response:</span>{' '}
                              <span className="text-charcoal-600">{campaign.response_notes}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-charcoal-700">Tracking URL:</span>{' '}
                            <code className="text-xs bg-white px-2 py-1 rounded border border-charcoal-200">
                              /preview/{campaign.preview_page_slug}?utm_source=email&utm_campaign={campaign.id}
                            </code>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
