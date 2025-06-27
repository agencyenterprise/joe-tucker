import { generateDraft } from '../new-post/actions'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { keywords } = await request.json()
    const draft = await generateDraft(keywords)
    return NextResponse.json({ draft })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}