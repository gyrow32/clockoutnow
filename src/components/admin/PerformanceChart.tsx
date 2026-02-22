'use client'

interface DataPoint {
  date: string
  campaigns_sent: number
  page_views: number
}

interface PerformanceChartProps {
  data: DataPoint[]
  days: number
}

export default function PerformanceChart({ data, days }: PerformanceChartProps) {
  if (data.length === 0) {
    return null
  }

  // Calculate max values for scaling
  const maxCampaigns = Math.max(...data.map((d) => d.campaigns_sent), 1)
  const maxViews = Math.max(...data.map((d) => d.page_views), 1)

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Show fewer labels on mobile
  const showEveryNth = days > 14 ? 7 : days > 7 ? 3 : 1

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Performance Over Time</h2>
          <p className="text-xs text-slate-500 mt-1">Last {days} days</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-600" />
            <span className="text-slate-600">Campaigns Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-slate-600">Page Views</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="relative h-64">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-slate-100" />
            ))}
          </div>

          {/* Chart area */}
          <div className="absolute inset-0 flex items-end gap-0.5">
            {data.map((point, i) => {
              const campaignHeight = (point.campaigns_sent / maxCampaigns) * 100
              const viewHeight = (point.page_views / maxViews) * 100
              const showLabel = i % showEveryNth === 0 || i === data.length - 1

              return (
                <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                  {/* Bars */}
                  <div className="w-full flex flex-col items-center gap-0.5 h-full justify-end">
                    {/* Campaigns bar */}
                    {point.campaigns_sent > 0 && (
                      <div className="relative w-full group">
                        <div
                          className="w-full bg-gradient-to-t from-slate-600 to-slate-400 rounded-t transition-all hover:from-slate-700 hover:to-slate-500"
                          style={{ height: `${campaignHeight}%` }}
                        >
                          {point.campaigns_sent > 0 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {point.campaigns_sent} sent
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Page views bar */}
                    {point.page_views > 0 && (
                      <div className="relative w-full group">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all hover:from-blue-600 hover:to-blue-400"
                          style={{ height: `${viewHeight}%` }}
                        >
                          {point.page_views > 0 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {point.page_views} views
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Date label */}
                  {showLabel && (
                    <div className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">
                      {formatDate(point.date)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
