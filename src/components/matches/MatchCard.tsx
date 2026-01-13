"use client";

import Link from "next/link";
import { GrantMatch } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, ArrowRight, Calendar, DollarSign } from "lucide-react";
import MatchScore from "./MatchScore";
import { useState } from "react";

interface MatchCardProps {
  match: GrantMatch;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { grant, similarity_score, match_reasoning, decision_recommendation } = match;

  if (!grant) return null;

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{grant.source}</Badge>
            {decision_recommendation === "APPLY" && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Recommended</Badge>
            )}
          </div>
          <h3 className="text-xl font-semibold leading-tight text-foreground">{grant.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
        <div className="md:pt-1 md:justify-self-end">
          <MatchScore score={similarity_score} />
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-md border border-input bg-muted/20 p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Why this matches
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {match_reasoning}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {grant.description}
        </p>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs text-muted-foreground hover:text-foreground"
            >
              {isOpen ? "Hide AI Insights" : "Show AI Insights"}
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 text-sm">
            <div className="rounded border border-primary/20 bg-primary/10 p-3 text-xs text-primary">
              <strong>Tip:</strong> This grant aligns well with your KPIs. Consider highlighting your timeline in the application.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-4 flex justify-end">
        <Link href={`/grants/${grant.id}`}>
          <Button className="group" variant="default">
            View Grant Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
