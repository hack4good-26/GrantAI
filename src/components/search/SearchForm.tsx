"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QueryInput from "./QueryInput";
import OptionalFields from "./OptionalFields";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const SUGGESTED_QUERIES = [
  "I want to increase capacity for elderly care services in the Bedok area by 20% over the next 2 years",
  "Launch a community mental health support program for youth aged 12-18 in underserved neighborhoods",
  "Develop a digital literacy training program for low-income families to improve employment opportunities"
];

export default function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    budget: [0, 0],
    duration: [0],
    kpis: 0
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: query,
          title: query.substring(0, 100),
          estimated_cost: filters.budget?.[0] > 0 ? filters.budget[0] : null,
          timeline_months: filters.duration?.[0] > 0 ? filters.duration[0] : null,
          kpis: filters.kpis > 0 ? filters.kpis : null,
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to process query' }));
        throw new Error(error.error || 'Failed to create result');
      }
      
      const result = await response.json();
      router.push(`/results?id=${result.id}`);
    } catch (error: any) {
      console.error('Failed to create result:', error);
      alert('Failed to process your query. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <LoadingSpinner text="Analyzing your service idea and finding suitable grants..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 md:space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Grant Discovery
        </p>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight text-foreground">
          What service grants are you looking for?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Describe your project idea and let AI surface the best funding matches.
        </p>
      </div>
      <QueryInput
        value={query}
        onChange={setQuery}
        canSubmit={!!query.trim()}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        filtersOpen={filtersOpen}
      />
      {!filtersOpen ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Suggested starting points
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="text-left text-sm px-4 py-2 rounded-full border border-border/70 bg-card/70 text-foreground/75 hover:text-foreground hover:border-primary/60 hover:bg-accent/80 transition-colors animate-pulse-accent"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {filtersOpen ? <OptionalFields filters={filters} onChange={handleFilterChange} /> : null}
    </form>
  );
}
