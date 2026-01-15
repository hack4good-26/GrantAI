import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import MatchList from '@/components/matches/MatchList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { QueryResult, RecommendedGrant } from '@/lib/types';

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const resultId = params.id;
  
  if (!resultId) {
    redirect('/dashboard');
  }
  
  try {
    const supabase = getSupabase();
    
    // Fetch result from database
    const { data: result, error: resultError } = await supabase
      .from('results')
      .select('*')
      .eq('id', resultId)
      .single();
    
    if (resultError || !result) {
      redirect('/dashboard');
    }

    // Extract grant IDs from recommended_grants array
    const grantIds = result.recommended_grants.map((rec: any) => rec.grant_id);
    
    // Fetch full grant details
    let grants: any[] = [];
    if (grantIds.length > 0) {
      const { data: grantData } = await supabase
        .from('grants_vectors')
        .select('*')
        .in('id', grantIds);
      grants = grantData || [];
    }

    // Merge grant details into recommended_grants
    const recommendedGrants: RecommendedGrant[] = result.recommended_grants.map((rec: any) => ({
      ...rec,
      grant: grants.find(g => g.id === rec.grant_id),
    }));

    return (
      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Grant Matches</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              We found {recommendedGrants.length} grants matching your project request.
            </p>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Your Query:</h3>
          <p className="text-base md:text-lg italic text-foreground">
            "{result.description}"
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg md:text-xl font-semibold">Top Recommendations</h2>
          {recommendedGrants.length > 0 ? (
            <MatchList matches={recommendedGrants} />
          ) : (
            <p className="text-muted-foreground">No recommendations available.</p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching results:', error);
    redirect('/dashboard');
  }
}
