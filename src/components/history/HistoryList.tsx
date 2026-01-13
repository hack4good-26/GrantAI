import { ServiceIdea } from "@/lib/types";
import HistoryCard from "./HistoryCard";

interface HistoryListProps {
  history: ServiceIdea[];
}

export default function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {history.map((idea) => (
        <HistoryCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
