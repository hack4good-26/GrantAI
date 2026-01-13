import { MOCK_MATCHES } from "@/lib/mock-data";
import MatchList from "@/components/matches/MatchList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MatchesPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const serviceIdeaId = searchParams.id;
  // In a real app, we would fetch the service idea and its matches based on the ID.
  // For now, we use mock data.
  
  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grant Matches</h1>
          <p className="text-muted-foreground">
            We found {MOCK_MATCHES.length} grants matching your service idea.
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Your Query:</h3>
        <p className="text-lg italic text-foreground">
          "Mental health workshops for teenagers in schools..."
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Top Recommendations</h2>
        <MatchList matches={MOCK_MATCHES} />
      </div>
    </div>
  );
}
