"use client";

import Link from "next/link";
import { RecommendedGrant } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, ArrowRight, Calendar, DollarSign } from "lucide-react";
import MatchScore from "./MatchScore";
import { useState } from "react";
import { extractFundingAmount, extractDeadline } from "@/lib/utils";

interface MatchCardProps {
  match: RecommendedGrant;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { grant, match_score, match_reasoning, decision_recommendation } = match;

  if (!grant) return null;

  const fundingText = extractFundingAmount(grant);
  const deadlineText = extractDeadline(grant);

  return (
    <div className="p-4 md:p-6 transition-colors hover:bg-muted/30">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {grant.application_status && (
              <Badge variant="outline">{grant.application_status}</Badge>
            )}
            {decision_recommendation === "APPLY" && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Recommended</Badge>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-semibold leading-tight text-foreground">
            {grant.title || "Untitled Grant"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {grant.description || "No description available"}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{fundingText}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{deadlineText}</span>
            </div>
          </div>
        </div>
        <div className="md:pt-1 md:justify-self-end">
          <MatchScore score={match_score / 100} />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-background shadow-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                Why this matches
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {match_reasoning}
              </p>
            </div>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isOpen ? "Hide AI Insights" : "Show AI Insights"}
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 text-sm px-1">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary leading-relaxed italic">
              <strong>Tip:</strong> This grant aligns well with your KPIs. Consider highlighting your timeline in the application.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-6 flex justify-end">
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
