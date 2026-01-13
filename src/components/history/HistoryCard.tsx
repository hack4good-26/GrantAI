import Link from "next/link";
import { ServiceIdea } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryCardProps {
  idea: ServiceIdea;
}

export default function HistoryCard({ idea }: HistoryCardProps) {
  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight line-clamp-1">{idea.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {idea.description}
          </p>
        </div>
        <Badge variant="secondary" className="whitespace-nowrap self-start">
          {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
        </Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4 text-xs text-muted-foreground">
          {idea.estimated_cost && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>~${idea.estimated_cost.toLocaleString()}</span>
            </div>
          )}
          {idea.timeline_months && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{idea.timeline_months} months</span>
            </div>
          )}
        </div>
        <Link
          href={`/matches?id=${idea.id}`}
          className="group inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
        >
          View Matches
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
