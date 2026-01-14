import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

/**
 * GET /api/grants
 * Fetches all grants from the database, sorted by creation date.
 */
export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data: grants, error } = await supabase
      .from('grants_vectors')
      .select('*')

    if (error) {
      console.error('Supabase error fetching grants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch grants from database' },
        { status: 500 }
      );
    }

    return NextResponse.json(grants || []);
  } catch (error: any) {
    console.error('Unexpected error in /api/grants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
