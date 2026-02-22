import { supabase } from './supabase'

// ============================================================
// TYPES
// ============================================================

export interface Campaign {
  id: string
  business_name: string
  contact: string
  preview_page_slug: string
  subject_line: string | null
  status: 'NEW' | 'CONTACTED' | 'REPLIED' | 'CLOSED'
  notes: string | null
  response_date: string | null
  response_notes: string | null
  sent_date: string
  created_at: string
  updated_at: string
}

export interface PageView {
  id: string
  page_slug: string
  utm_source: string | null
  utm_campaign: string | null
  referrer: string | null
  viewed_at: string
}

export interface CreateCampaignInput {
  business_name: string
  contact: string
  preview_page_slug: string
  subject_line?: string
  notes?: string
}

export interface UpdateCampaignInput {
  status?: 'NEW' | 'CONTACTED' | 'REPLIED' | 'CLOSED'
  response_notes?: string
  response_date?: string
  notes?: string
}

// ============================================================
// CAMPAIGN QUERIES
// ============================================================

/**
 * Fetch all campaigns, sorted by sent date (newest first)
 */
export async function getAllCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('sent_date', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Create a new campaign
 */
export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([input])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an existing campaign
 */
export async function updateCampaign(
  id: string,
  input: UpdateCampaignInput
): Promise<Campaign> {
  // If setting status to REPLIED and no response_date, auto-set it
  const updates = { ...input }
  if (updates.status === 'REPLIED' && !updates.response_date) {
    updates.response_date = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a campaign (soft delete by status or hard delete)
 */
export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase.from('campaigns').delete().eq('id', id)
  if (error) throw error
}

/**
 * Get campaign summary stats
 */
export async function getCampaignSummary() {
  const campaigns = await getAllCampaigns()

  const totalSent = campaigns.length
  const totalReplied = campaigns.filter((c) => c.status === 'REPLIED').length
  const totalClosed = campaigns.filter((c) => c.status === 'CLOSED').length
  const responseRate = totalSent > 0 ? (totalReplied / totalSent) * 100 : 0

  return {
    total_sent: totalSent,
    total_replied: totalReplied,
    total_closed: totalClosed,
    response_rate: Math.round(responseRate * 10) / 10, // Round to 1 decimal
  }
}

// ============================================================
// PAGE VIEW QUERIES
// ============================================================

/**
 * Track a page view
 */
export async function trackPageView(params: {
  page_slug: string
  utm_source?: string | null
  utm_campaign?: string | null
  referrer?: string | null
}): Promise<void> {
  const { error } = await supabase.from('page_views').insert([params])
  if (error) throw error
}

/**
 * Get page view counts by slug
 */
export async function getPageViewsBySlug(days = 30): Promise<
  Array<{
    slug: string
    total_views: number
    email_views: number
  }>
> {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const { data, error } = await supabase
    .from('page_views')
    .select('page_slug, utm_source')
    .gte('viewed_at', cutoff.toISOString())

  if (error) throw error

  // Aggregate by slug
  const aggregated = (data || []).reduce(
    (acc, row) => {
      const slug = row.page_slug
      if (!acc[slug]) {
        acc[slug] = { total: 0, email: 0 }
      }
      acc[slug].total++
      if (row.utm_source === 'email') {
        acc[slug].email++
      }
      return acc
    },
    {} as Record<string, { total: number; email: number }>
  )

  return Object.entries(aggregated).map(([slug, counts]) => ({
    slug,
    total_views: counts.total,
    email_views: counts.email,
  }))
}

/**
 * Get traffic source breakdown
 */
export async function getTrafficSources(days = 30): Promise<Record<string, number>> {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const { data, error } = await supabase
    .from('page_views')
    .select('utm_source')
    .gte('viewed_at', cutoff.toISOString())

  if (error) throw error

  const sources = (data || []).reduce(
    (acc, row) => {
      const source = row.utm_source || 'direct'
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return sources
}

/**
 * Get total page views across all pages
 */
export async function getTotalPageViews(days = 30): Promise<number> {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const { count, error } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('viewed_at', cutoff.toISOString())

  if (error) throw error
  return count || 0
}

// ============================================================
// ADVANCED ANALYTICS
// ============================================================

/**
 * Get click-through rate per campaign
 * Returns campaigns with view counts and CTR
 */
export async function getCampaignClickThroughRates(days = 30) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  // Get campaigns
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('*')
    .gte('sent_date', cutoff.toISOString())
    .order('sent_date', { ascending: false })

  if (campaignsError) throw campaignsError

  // Get all page views
  const { data: pageViews, error: viewsError } = await supabase
    .from('page_views')
    .select('page_slug, utm_campaign, utm_source')
    .gte('viewed_at', cutoff.toISOString())

  if (viewsError) throw viewsError

  // Calculate CTR for each campaign
  const campaignsWithCTR = (campaigns || []).map((campaign) => {
    // Count views for this campaign's preview page
    const campaignViews = (pageViews || []).filter(
      (view) => view.page_slug === campaign.preview_page_slug
    )

    const totalViews = campaignViews.length
    const emailViews = campaignViews.filter((v) => v.utm_source === 'email').length

    // CTR = (email views / 1 email sent) * 100
    // In future, could track multiple sends per campaign
    const clickThroughRate = emailViews > 0 ? 100 : 0

    return {
      ...campaign,
      total_views: totalViews,
      email_views: emailViews,
      click_through_rate: clickThroughRate,
    }
  })

  return campaignsWithCTR
}

/**
 * Get response time analytics
 * Calculate average days to reply
 */
export async function getResponseTimeAnalytics() {
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('sent_date, response_date, status')
    .eq('status', 'REPLIED')
    .not('response_date', 'is', null)

  if (error) throw error

  if (!campaigns || campaigns.length === 0) {
    return {
      average_days_to_reply: 0,
      fastest_reply_days: 0,
      slowest_reply_days: 0,
      total_replies: 0,
    }
  }

  // Calculate days between sent and replied
  const responseTimes = campaigns.map((c) => {
    const sent = new Date(c.sent_date)
    const replied = new Date(c.response_date!)
    const diffMs = replied.getTime() - sent.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    return diffDays
  })

  const avgDays = responseTimes.reduce((sum, days) => sum + days, 0) / responseTimes.length
  const fastestDays = Math.min(...responseTimes)
  const slowestDays = Math.max(...responseTimes)

  return {
    average_days_to_reply: Math.round(avgDays * 10) / 10,
    fastest_reply_days: Math.round(fastestDays * 10) / 10,
    slowest_reply_days: Math.round(slowestDays * 10) / 10,
    total_replies: campaigns.length,
  }
}

/**
 * Get performance over time (time-series data)
 * Returns daily counts of campaigns sent and page views
 */
export async function getPerformanceOverTime(days = 30) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  // Get campaigns by day
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('sent_date')
    .gte('sent_date', cutoff.toISOString())

  if (campaignsError) throw campaignsError

  // Get page views by day
  const { data: pageViews, error: viewsError } = await supabase
    .from('page_views')
    .select('viewed_at')
    .gte('viewed_at', cutoff.toISOString())

  if (viewsError) throw viewsError

  // Aggregate by date
  const dateMap: Record<
    string,
    { date: string; campaigns_sent: number; page_views: number }
  > = {}

  // Initialize all dates in range with 0 counts
  for (let i = 0; i < days; i++) {
    const date = new Date(cutoff)
    date.setDate(date.getDate() + i)
    const dateKey = date.toISOString().split('T')[0]
    dateMap[dateKey] = { date: dateKey, campaigns_sent: 0, page_views: 0 }
  }

  // Count campaigns by date
  ;(campaigns || []).forEach((c) => {
    const dateKey = c.sent_date.split('T')[0]
    if (dateMap[dateKey]) {
      dateMap[dateKey].campaigns_sent++
    }
  })

  // Count page views by date
  ;(pageViews || []).forEach((v) => {
    const dateKey = v.viewed_at.split('T')[0]
    if (dateMap[dateKey]) {
      dateMap[dateKey].page_views++
    }
  })

  // Convert to array and sort by date
  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Get top performing pages
 * Returns pages ranked by total views
 */
export async function getTopPerformingPages(days = 30, limit = 10) {
  const pageViews = await getPageViewsBySlug(days)
  return pageViews.sort((a, b) => b.total_views - a.total_views).slice(0, limit)
}
