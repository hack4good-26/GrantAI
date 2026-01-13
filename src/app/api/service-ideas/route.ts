import { NextRequest, NextResponse } from 'next/server';

// GET /api/service-ideas - List all service ideas (for history)
export async function GET(request: NextRequest) {
  // TODO: Implement - fetch all service ideas from backend
  return NextResponse.json([]);
}

// POST /api/service-ideas - Create service idea
export async function POST(request: NextRequest) {
  const data = await request.json();

  // TODO: Implement - create service idea and generate embedding
  return NextResponse.json({
    id: 1,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}
