'use client'

interface AnalyticsChartProps {
  pageViews: Array<{ slug: string; total_views: number; email_views: number }>
  trafficSources: Record<string, number>
}

export default function AnalyticsChart({
  pageViews,
  trafficSources,
}: AnalyticsChartProps) {
  // Sort page views by total views descending
  const sortedViews = [...pageViews].sort((a, b) => b.total_views - a.total_views)
  const maxViews = sortedViews[0]?.total_views || 1

  return (
    <div className="bg-white rounded-xl shadow-sm border border-charcoal-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-charcoal-100">
        <h2 className="text-lg font-semibold text-charcoal-800">Analytics</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Page Views Bar Chart */}
        {sortedViews.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-charcoal-700 mb-4">
              Page Views (Last 30 Days)
            </h3>
            <div className="space-y-3">
              {sortedViews.map((page) => {
                const percentage = (page.total_views / maxViews) * 100
                const emailPercentage =
                  page.total_views > 0
                    ? (page.email_views / page.total_views) * 100
                    : 0

                return (
                  <div key={page.slug}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-charcoal-700 font-medium truncate">
                        {page.slug}
                      </span>
                      <span className="text-xs text-charcoal-500 ml-2">
                        {page.total_views} views ({page.email_views} from email)
                      </span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                      {/* Total views bar */}
                      <div
                        className="h-full bg-gradient-to-r from-slate-400 to-slate-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      {/* Email views overlay */}
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${(emailPercentage / 100) * percentage}%` }}
                      />
                      {/* Count label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          {page.total_views}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-500" />
                <span className="text-charcoal-600">Total views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-charcoal-600">Email views</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-charcoal-400">No page views yet</p>
          </div>
        )}

        {/* Traffic Sources */}
        {Object.keys(trafficSources).length > 0 && (
          <div className="pt-6 border-t border-charcoal-100">
            <h3 className="text-sm font-semibold text-charcoal-700 mb-3">
              Traffic Sources
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(trafficSources).map(([source, count]) => (
                <div
                  key={source}
                  className="px-4 py-2 rounded-lg bg-gray-50 border border-charcoal-100"
                >
                  <div className="text-xs text-charcoal-500 uppercase tracking-wide">
                    {source}
                  </div>
                  <div className="text-lg font-bold text-charcoal-800">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
