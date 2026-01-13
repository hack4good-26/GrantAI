import { GrantMatch } from "@/lib/types";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: GrantMatch[];
}

export default function MatchList({ matches }: MatchListProps) {
  // Sort matches by similarity score descending
  const sortedMatches = [...matches].sort((a, b) => b.similarity_score - a.similarity_score);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
