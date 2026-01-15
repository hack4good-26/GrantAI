"use client";

import Link from "next/link";
import { RecommendedGrant } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Calendar, DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";
import MatchScore from "./MatchScore";
import { extractFundingAmount, extractDeadline } from "@/lib/utils";

interface MatchCardProps {
  match: RecommendedGrant;
}

export default function MatchCard({ match }: MatchCardProps) {
  const {
    grant,
    match_score,
    match_reasoning,
    decision_recommendation,
    why_fits,
    concerns,
  } = match;

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
        {(why_fits?.length || concerns?.length) ? (
          <div className="grid gap-3 md:grid-cols-2">
            {why_fits?.length ? (
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <h5 className="text-sm font-medium text-foreground">Why it fits</h5>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {why_fits.map((reason, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {concerns?.length ? (
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h5 className="text-sm font-medium text-foreground">Concerns</h5>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {concerns.map((concern, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
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
