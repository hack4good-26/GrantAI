"use client";

import { MOCK_HISTORY } from "@/lib/mock-data";
import HistoryList from "@/components/history/HistoryList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search History</h1>
          <p className="text-muted-foreground">
            View and revisit your past service ideas and grant matches.
          </p>
        </div>
        <Link href="/dashboard">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Search
          </Button>
        </Link>
      </div>

      {MOCK_HISTORY.length > 0 ? (
        <HistoryList history={MOCK_HISTORY} />
      ) : (
        <EmptyState 
          title="No search history yet" 
          description="Start by describing a service idea to find matching grants."
          action={
            <Link href="/dashboard">
              <Button variant="outline" className="mt-4">
                Start First Search
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
