import { NextRequest, NextResponse } from 'next/server';

// GET /api/grants - List all grants
export async function GET(request: NextRequest) {
  // TODO: Implement - fetch from Python backend or database
  return NextResponse.json([]);
}
