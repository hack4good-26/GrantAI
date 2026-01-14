import Link from "next/link";
import { QueryResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryCardProps {
  result: QueryResult;
}

export default function HistoryCard({ result }: HistoryCardProps) {
  return (
    <div className="p-6 hover:bg-muted/50 transition-colors">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight line-clamp-1 text-foreground">
            {result.title || 'Untitled Search'}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {result.description}
          </p>
        </div>
        <Badge variant="secondary" className="whitespace-nowrap self-start">
          {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 text-xs text-muted-foreground">
          {result.estimated_cost && (
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-muted">
                <DollarSign className="h-3 w-3" />
              </div>
              <span>~${result.estimated_cost.toLocaleString()}</span>
            </div>
          )}
          {result.timeline_months && (
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-muted">
                <Clock className="h-3 w-3" />
              </div>
              <span>{result.timeline_months} months</span>
            </div>
          )}
        </div>
        <Link
          href={`/results?id=${result.id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View Matches ({result.recommended_grants.length})
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
