import { ServiceIdea } from "@/lib/types";
import HistoryCard from "./HistoryCard";

interface HistoryListProps {
  history: ServiceIdea[];
}

export default function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="divide-y rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {history.map((idea) => (
        <HistoryCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
