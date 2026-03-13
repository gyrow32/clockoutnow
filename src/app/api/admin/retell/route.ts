import { NextRequest, NextResponse } from 'next/server'

const ADMIN_KEY = process.env.ADMIN_ACCESS_KEY?.trim()
const RETELL_API_KEY = process.env.RETELL_API_KEY
const AGENT_ID = process.env.RETELL_AGENT_ID
const LLM_ID = process.env.RETELL_LLM_ID

function verifyAuth(req: NextRequest): boolean {
  if (!ADMIN_KEY) return false
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '').trim()
  return token === ADMIN_KEY
}

/**
 * GET /api/admin/retell
 * Fetch agent details and LLM config from Retell
 */
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!RETELL_API_KEY || !AGENT_ID || !LLM_ID) {
    return NextResponse.json({ error: 'Retell environment variables not configured' }, { status: 500 })
  }

  try {
    const [agentRes, llmRes] = await Promise.all([
      fetch(`https://api.retellai.com/get-agent/${AGENT_ID}`, {
        headers: { Authorization: `Bearer ${RETELL_API_KEY}` },
      }),
      fetch(`https://api.retellai.com/get-retell-llm/${LLM_ID}`, {
        headers: { Authorization: `Bearer ${RETELL_API_KEY}` },
      }),
    ])

    if (!agentRes.ok) {
      throw new Error(`Failed to fetch agent: ${agentRes.status}`)
    }
    if (!llmRes.ok) {
      throw new Error(`Failed to fetch LLM: ${llmRes.status}`)
    }

    const [agent, llm] = await Promise.all([agentRes.json(), llmRes.json()])

    return NextResponse.json({ agent, llm })
  } catch (error) {
    console.error('Error fetching Retell data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Retell data' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/retell
 * Update the LLM system prompt
 */
export async function PATCH(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!RETELL_API_KEY || !LLM_ID) {
    return NextResponse.json({ error: 'Retell environment variables not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { general_prompt } = body

    if (typeof general_prompt !== 'string') {
      return NextResponse.json({ error: 'general_prompt is required' }, { status: 400 })
    }

    const res = await fetch(`https://api.retellai.com/update-retell-llm/${LLM_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ general_prompt }),
    })

    if (!res.ok) {
      throw new Error(`Failed to update LLM: ${res.status}`)
    }

    const updated = await res.json()
    return NextResponse.json({ llm: updated })
  } catch (error) {
    console.error('Error updating Retell LLM:', error)
    return NextResponse.json(
      { error: 'Failed to update Retell LLM' },
      { status: 500 }
    )
  }
}
