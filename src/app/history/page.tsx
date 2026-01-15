import { getSupabase } from '@/lib/supabase';
import HistoryList from "@/components/history/HistoryList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";
import ClearHistoryButton from "@/components/history/ClearHistoryButton";
import type { QueryResult } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const supabase = getSupabase();
  const { data: results, error } = await supabase
    .from('results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  const hasResults = (results?.length ?? 0) > 0;

  if (!hasResults) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6 md:px-8 md:py-8">
        <EmptyState 
          title="No search history yet" 
          description="Start by describing a project request to find matching grants."
          action={
            <Link href="/dashboard">
              <Button variant="outline" className="mt-4">
                Start First Search
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Search History</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            View and revisit your past project requests and grant matches.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:self-start">
          <ClearHistoryButton />
          <Link href="/dashboard">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </Link>
        </div>
      </div>
      <HistoryList history={results as QueryResult[]} />
    </div>
  );
}
