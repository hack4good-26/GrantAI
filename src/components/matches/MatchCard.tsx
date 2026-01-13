"use client";

import Link from "next/link";
import { GrantMatch } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, ArrowRight, Calendar, DollarSign } from "lucide-react";
import MatchScore from "./MatchScore";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: GrantMatch;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { grant, similarity_score, match_reasoning, decision_recommendation } = match;

  if (!grant) return null;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="mb-2">
              {grant.source}
            </Badge>
            {decision_recommendation === 'APPLY' && (
              <Badge className="bg-green-600 hover:bg-green-700">Recommended</Badge>
            )}
          </div>
          <h3 className="font-bold text-xl leading-tight text-blue-900">
            {grant.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span>
                {grant.funding_min?.toLocaleString()} - {grant.funding_max?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Due: {new Date(grant.deadline || "").toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <MatchScore score={similarity_score} />
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg my-2 border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-300 mb-1">
                Why this matches
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {match_reasoning}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {grant.description}
        </p>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-muted-foreground hover:text-foreground">
              {isOpen ? "Hide AI Insights" : "Show AI Insights"}
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 text-sm">
            <div className="bg-blue-50/50 p-3 rounded text-blue-800 text-xs">
              <strong>Tip:</strong> This grant aligns well with your KPIs. Consider highlighting your timeline in the application.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="pt-2 bg-slate-50/50 dark:bg-slate-900/50 border-t">
        <Link href={`/grants/${grant.id}`} className="w-full">
          <Button className="w-full group" variant="default">
            View Grant Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
