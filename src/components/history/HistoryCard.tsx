import Link from "next/link";
import { ServiceIdea } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryCardProps {
  idea: ServiceIdea;
}

export default function HistoryCard({ idea }: HistoryCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg line-clamp-1">
            {idea.title}
          </CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap">
            {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {idea.description}
        </p>
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
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/matches?id=${idea.id}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between group px-0 hover:bg-transparent hover:text-blue-600">
            View Matches
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
