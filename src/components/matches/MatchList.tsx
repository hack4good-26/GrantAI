import { RecommendedGrant } from "@/lib/types";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: RecommendedGrant[];
}

export default function MatchList({ matches }: MatchListProps) {
  // Sort matches by match_score descending (0-100 scale from LLM)
  const sortedMatches = [...matches].sort((a, b) => b.match_score - a.match_score);

  return (
    <div className="divide-y rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {sortedMatches.map((match) => (
        <MatchCard key={match.grant_id} match={match} />
      ))}
    </div>
  );
}
