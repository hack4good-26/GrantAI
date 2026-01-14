import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    
    // Fetch result from database
    const { data: result, error: resultError } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single();
    
    if (resultError || !result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // Extract grant IDs from recommended_grants array
    const grantIds = result.recommended_grants.map((rec: any) => rec.grant_id);
    
    if (grantIds.length === 0) {
      return NextResponse.json({
        ...result,
        recommended_grants: [],
      });
    }

    // Fetch full grant details for each recommended grant
    const { data: grants, error: grantsError } = await supabase
      .from('grants_vectors')
      .select('*')
      .in('id', grantIds);

    if (grantsError) {
      console.error('Error fetching grants:', grantsError);
      // Return result without grant details if fetch fails
      return NextResponse.json(result);
    }

    // Merge grant details into recommended_grants array
    const recommendedGrantsWithDetails = result.recommended_grants.map((rec: any) => ({
      ...rec,
      grant: grants?.find(g => g.id === rec.grant_id),
    }));

    return NextResponse.json({
      ...result,
      recommended_grants: recommendedGrantsWithDetails,
    });

  } catch (error: any) {
    console.error('Error in GET /api/results/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch result' },
      { status: 500 }
    );
  }
}
