'use client'

import { useEffect, useState } from 'react'

interface RetellAgentPanelProps {
  authKey: string
}

interface AgentData {
  agent: {
    agent_name?: string
    voice_id?: string
    agent_id?: string
    last_modification_timestamp?: number
  }
  llm: {
    general_prompt?: string
    llm_id?: string
  }
}

export default function RetellAgentPanel({ authKey }: RetellAgentPanelProps) {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/retell', {
        headers: { Authorization: authKey },
      })
      if (!res.ok) throw new Error('Failed to fetch agent data')
      const result = await res.json()
      setData(result)
      setPrompt(result.llm?.general_prompt || '')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setToast(null)
    try {
      const res = await fetch('/api/admin/retell', {
        method: 'PATCH',
        headers: {
          Authorization: authKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ general_prompt: prompt }),
      })
      if (!res.ok) throw new Error('Failed to save')
      const result = await res.json()
      setData((prev) => prev ? { ...prev, llm: result.llm } : prev)
      setToast({ type: 'success', message: 'System prompt updated successfully' })
    } catch {
      setToast({ type: 'error', message: 'Failed to save changes' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const hasChanges = data ? prompt !== (data.llm?.general_prompt || '') : false

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-slate-500 mt-4">Loading voice agent...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-5 py-2 text-sm font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  const lastModified = data.agent.last_modification_timestamp
    ? new Date(data.agent.last_modification_timestamp).toLocaleString()
    : 'Unknown'

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Agent Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Agent Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Name</p>
            <p className="text-sm text-slate-900 mt-1">{data.agent.agent_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Voice</p>
            <p className="text-sm text-slate-900 mt-1">{data.agent.voice_id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Agent ID</p>
            <p className="text-sm text-slate-900 mt-1 font-mono text-xs">{data.agent.agent_id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last Modified</p>
            <p className="text-sm text-slate-900 mt-1">{lastModified}</p>
          </div>
        </div>
      </div>

      {/* System Prompt Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">System Prompt</h3>
          {hasChanges && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={20}
          className="w-full px-4 py-3 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y text-slate-800"
          placeholder="Enter the agent's system prompt..."
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">
            {prompt.length} characters
          </p>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
