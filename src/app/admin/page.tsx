'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Campaign } from '@/lib/supabase-queries'
import SummaryCards from '@/components/admin/SummaryCards'
import CampaignTable from '@/components/admin/CampaignTable'
import AddCampaignModal from '@/components/admin/AddCampaignModal'
import AnalyticsChart from '@/components/admin/AnalyticsChart'
import LeadsTable from '@/components/admin/LeadsTable'
import PerformanceChart from '@/components/admin/PerformanceChart'
import EngagementMetrics from '@/components/admin/EngagementMetrics'

const ADMIN_KEY = 'buffalo2026'

interface DashboardData {
  campaigns: Campaign[]
  summary: {
    total_sent: number
    total_replied: number
    response_rate: number
  }
  analytics: {
    page_views: Array<{ slug: string; total_views: number; email_views: number }>
    traffic_sources: Record<string, number>
    total_views: number
    campaign_ctr: Array<{
      id: string
      business_name: string
      preview_page_slug: string
      status: string
      sent_date: string
      total_views: number
      email_views: number
      click_through_rate: number
    }>
    response_time: {
      average_days_to_reply: number
      fastest_reply_days: number
      slowest_reply_days: number
      total_replies: number
    }
    performance_over_time: Array<{
      date: string
      campaigns_sent: number
      page_views: number
    }>
    top_pages: Array<{ slug: string; total_views: number; email_views: number }>
    days: number
  }
}

function AdminContent() {
  const [authorized, setAuthorized] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [error, setError] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads'>('campaigns')
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('key') === ADMIN_KEY) {
      setAuthorized(true)
      fetchDashboardData()
    }
  }, [searchParams])

  useEffect(() => {
    // Fetch total preview pages count
    fetch('/api/preview-pages')
      .then((r) => r.json())
      .then((pages) => setTotalPages(pages.length))
      .catch(() => {})
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      const [campaignsRes, analyticsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/campaigns', {
          headers: { Authorization: ADMIN_KEY },
        }),
        fetch('/api/admin/analytics', {
          headers: { Authorization: ADMIN_KEY },
        }),
        fetch('/api/admin/leads', {
          headers: { Authorization: ADMIN_KEY },
        }),
      ])

      if (!campaignsRes.ok || !analyticsRes.ok || !leadsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [campaignsData, analyticsData, leadsData] = await Promise.all([
        campaignsRes.json(),
        analyticsRes.json(),
        leadsRes.json(),
      ])

      setData({
        campaigns: campaignsData.campaigns,
        summary: campaignsData.summary,
        analytics: analyticsData,
      })
      setLeads(leadsData.leads || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleUnlock() {
    if (keyInput.trim() === ADMIN_KEY) {
      setAuthorized(true)
      setError(false)
      fetchDashboardData()
    } else {
      setError(true)
    }
  }

  async function handleAddCampaign(formData: any) {
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ADMIN_KEY,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to create campaign')

      const { tracking_url } = await res.json()
      await fetchDashboardData()
      return tracking_url
    } catch (error) {
      console.error('Error creating campaign:', error)
      return null
    }
  }

  async function handleUpdateCampaign(id: string, status: Campaign['status']) {
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ADMIN_KEY,
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Failed to update campaign')
    } catch (error) {
      console.error('Error updating campaign:', error)
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-800 via-charcoal-700 to-green-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-charcoal-100 p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-charcoal-800 mb-2">Admin Access</h1>
          <p className="text-charcoal-400 text-sm mb-6">
            Enter the access key to view the dashboard
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value)
                setError(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Access key"
              className={`flex-1 px-4 py-3 text-sm rounded-lg border bg-white text-charcoal-800 outline-none transition-colors ${
                error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-charcoal-200 focus:border-green-600'
              }`}
              autoFocus
            />
            <button
              onClick={handleUnlock}
              className="px-6 py-3 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Unlock
            </button>
          </div>
          {error && <p className="text-red-500 text-xs">Invalid access key</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Live</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Campaign Dashboard
              </h1>
              <p className="text-slate-600">
                Monitor campaigns, track analytics, and manage your pipeline
              </p>
            </div>
            <button
              onClick={() => fetchDashboardData()}
              disabled={loading}
              className="group px-5 py-2.5 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow"
            >
              <svg
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {loading && !data ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-charcoal-400 mt-4">Loading dashboard...</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards
              totalSent={data.summary.total_sent}
              responseRate={data.summary.response_rate}
              totalViews={data.analytics.total_views}
              totalPages={totalPages}
            />

            {/* Tabs */}
            <div className="flex items-center justify-between bg-white rounded-lg p-1 shadow-sm border border-slate-200">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-md relative ${
                    activeTab === 'campaigns'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Campaigns
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === 'campaigns'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {data.campaigns.length}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-md relative ${
                    activeTab === 'leads'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Leads
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === 'leads'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {leads.length}
                    </span>
                  </span>
                </button>
              </div>
              {activeTab === 'campaigns' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="group px-5 py-2.5 text-sm font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 flex items-center gap-2 shadow-sm"
                >
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Log New Email
              </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'campaigns' ? (
              <>
                {/* Campaign Table */}
                <CampaignTable
                  campaigns={data.campaigns}
                  onUpdate={handleUpdateCampaign}
                  onRefresh={fetchDashboardData}
                />

                {/* Performance Over Time */}
                <PerformanceChart
                  data={data.analytics.performance_over_time}
                  days={data.analytics.days}
                />

                {/* Engagement Metrics */}
                <EngagementMetrics
                  campaignCTR={data.analytics.campaign_ctr}
                  responseTime={data.analytics.response_time}
                />

                {/* Analytics Chart */}
                <AnalyticsChart
                  pageViews={data.analytics.page_views}
                  trafficSources={data.analytics.traffic_sources}
                />
              </>
            ) : (
              <>
                {/* Leads Table */}
                <LeadsTable leads={leads} />
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-charcoal-400">Failed to load dashboard data</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-6 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Add Campaign Modal */}
      <AddCampaignModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCampaign}
      />
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminContent />
    </Suspense>
  )
}
