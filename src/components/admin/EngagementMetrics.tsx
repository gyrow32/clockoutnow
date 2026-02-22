'use client'

interface CampaignCTR {
  id: string
  business_name: string
  preview_page_slug: string
  status: string
  sent_date: string
  total_views: number
  email_views: number
  click_through_rate: number
}

interface ResponseTimeData {
  average_days_to_reply: number
  fastest_reply_days: number
  slowest_reply_days: number
  total_replies: number
}

interface EngagementMetricsProps {
  campaignCTR: CampaignCTR[]
  responseTime: ResponseTimeData
}

export default function EngagementMetrics({
  campaignCTR,
  responseTime,
}: EngagementMetricsProps) {
  // Get top 5 campaigns by views
  const topCampaigns = [...campaignCTR]
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, 5)

  // Calculate overall engagement rate
  const totalViews = campaignCTR.reduce((sum, c) => sum + c.total_views, 0)
  const totalEmailViews = campaignCTR.reduce((sum, c) => sum + c.email_views, 0)
  const overallCTR = campaignCTR.length > 0 ? (totalEmailViews / campaignCTR.length) * 100 : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Campaign Click-Through Rates */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Campaign Engagement</h2>
          <p className="text-xs text-slate-500 mt-1">
            Click-through performance per campaign
          </p>
        </div>

        <div className="p-6">
          {topCampaigns.length > 0 ? (
            <>
              {/* Overall stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{totalViews}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                    Total Views
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{totalEmailViews}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                    From Email
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(overallCTR)}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                    Avg CTR
                  </div>
                </div>
              </div>

              {/* Top campaigns */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Top Performing Campaigns
                </h3>
                {topCampaigns.map((campaign, i) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                        <span className="text-sm font-medium text-slate-900 truncate">
                          {campaign.business_name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {new Date(campaign.sent_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {campaign.total_views}
                        </div>
                        <div className="text-xs text-slate-500">views</div>
                      </div>
                      {campaign.email_views > 0 && (
                        <div className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          {campaign.click_through_rate}% CTR
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📧</div>
              <p className="text-sm text-slate-400">No campaign data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Response Time Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Response Time Analytics</h2>
          <p className="text-xs text-slate-500 mt-1">
            How quickly leads respond to outreach
          </p>
        </div>

        <div className="p-6">
          {responseTime.total_replies > 0 ? (
            <div className="space-y-6">
              {/* Main metric */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="text-5xl font-bold text-emerald-700 mb-2">
                  {responseTime.average_days_to_reply}
                </div>
                <div className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                  Average Days to Reply
                </div>
              </div>

              {/* Detail stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Fastest
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {responseTime.fastest_reply_days}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">days</div>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Slowest
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {responseTime.slowest_reply_days}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">days</div>
                </div>
              </div>

              {/* Total replies */}
              <div className="pt-4 border-t border-slate-200 text-center">
                <span className="text-sm text-slate-600">
                  Based on{' '}
                  <span className="font-bold text-slate-900">
                    {responseTime.total_replies}
                  </span>{' '}
                  {responseTime.total_replies === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1">
                No responses yet
              </h3>
              <p className="text-xs text-slate-500">
                Response time data will appear when leads reply
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
