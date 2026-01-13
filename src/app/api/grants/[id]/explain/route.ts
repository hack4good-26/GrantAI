import { NextRequest, NextResponse } from 'next/server';

// POST /api/grants/[id]/explain - Ask question about grant (AI Explainer)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { question } = await request.json();

  // TODO: Implement - call AI explainer with grant context and question
  return NextResponse.json({
    question,
    answer: '',
    grant_context: {}
  });
}
