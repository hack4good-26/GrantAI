import { ServiceIdea } from "@/lib/types";
import HistoryCard from "./HistoryCard";

interface HistoryListProps {
  history: ServiceIdea[];
}

export default function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="divide-y rounded-lg border border-border bg-background">
      {history.map((idea) => (
        <HistoryCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
