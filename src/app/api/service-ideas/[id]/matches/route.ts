import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/embeddings';

// Number of matching grants to retrieve
const DEFAULT_MATCH_COUNT = 5;

// GET /api/service-ideas/[id]/matches - Get matching grants for service idea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Get query from URL search params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Generate embedding for the query
    console.log('Generating embedding for query:', query);
    const queryEmbedding = await generateEmbedding(query);
    console.log('Embedding generated, length:', queryEmbedding.length);

    // Step 2: Perform vector similarity search
    console.log(`Calling match_grants with k=${DEFAULT_MATCH_COUNT}...`);
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc('match_grants', {
      query_embedding: queryEmbedding,
      match_count: DEFAULT_MATCH_COUNT
    });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Step 3: Console.log the results
    console.log('Retrieved results:', data);
    console.log('Number of matches:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('Top match:', data[0]);
    }

    // Step 4: Return the results
    return NextResponse.json(data || []);

  } catch (error) {
    console.error('Error in RAG retrieval:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve matching grants' },
      { status: 500 }
    );
  }
}
