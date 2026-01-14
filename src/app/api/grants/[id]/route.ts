import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET /api/grants/[id] - Get grant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    
    const { data: grant, error } = await supabase
      .from('grants_vectors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // PGRST116 is the error code when no rows are found
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Grant not found' },
          { status: 404 }
        );
      }
      
      console.error('Supabase error fetching grant:', error);
      return NextResponse.json(
        { error: 'Failed to fetch grant from database' },
        { status: 500 }
      );
    }

    return NextResponse.json(grant);
  } catch (error: any) {
    console.error('Unexpected error in /api/grants/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
