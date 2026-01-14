import { QueryResult } from "@/lib/types";
import HistoryCard from "./HistoryCard";

interface HistoryListProps {
  history: QueryResult[];
}

export default function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="divide-y rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {history.map((result) => (
        <HistoryCard key={result.id} result={result} />
      ))}
    </div>
  );
}
