import { NextRequest, NextResponse } from 'next/server';

// GET /api/service-ideas/[id]/matches - Get matching grants for service idea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: Implement - perform vector search and return matching grants
  return NextResponse.json([]);
}
