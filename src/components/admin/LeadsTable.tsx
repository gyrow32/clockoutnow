'use client'

interface Lead {
  id: string
  company_name: string
  industry: string | null
  city_region: string | null
  phone: string | null
  email: string | null
  website: string | null
  has_website: boolean
  business_strength: string | null
  status: string
}

interface LeadsTableProps {
  leads: Lead[]
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-charcoal-100 p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-charcoal-800 mb-2">
          No leads yet
        </h3>
        <p className="text-charcoal-400 text-sm">
          Import leads from your spreadsheet to get started
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-charcoal-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-charcoal-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal-800">
          Leads Database ({leads.length} businesses)
        </h2>
        <div className="text-sm text-charcoal-500">
          From Excel import
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-charcoal-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Strength
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-charcoal-800">
                    {lead.company_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {lead.industry || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-600">
                  {lead.city_region || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-600">
                  {lead.phone || lead.email || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.has_website ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-charcoal-500 max-w-xs truncate">
                    {lead.business_strength || 'N/A'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
