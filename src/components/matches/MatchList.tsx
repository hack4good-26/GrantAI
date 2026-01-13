import { GrantMatch } from "@/lib/types";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: GrantMatch[];
}

export default function MatchList({ matches }: MatchListProps) {
  // Sort matches by similarity score descending
  const sortedMatches = [...matches].sort((a, b) => b.similarity_score - a.similarity_score);

  return (
    <div className="divide-y rounded-lg border border-border bg-background">
      {sortedMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
