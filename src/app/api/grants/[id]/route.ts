import { NextRequest, NextResponse } from 'next/server';

// GET /api/grants/[id] - Get grant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: Implement - fetch grant by ID from backend
  return NextResponse.json({ id });
}
