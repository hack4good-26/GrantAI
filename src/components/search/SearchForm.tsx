"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QueryInput from "./QueryInput";
import OptionalFields from "./OptionalFields";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    budget: [10000, 100000],
    duration: [12],
    kpis: 3
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
          estimated_cost: filters.budget?.[0] || null,
          timeline_months: filters.duration?.[0] || null,
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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4 md:space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          What service grants are you looking for?
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Describe your project idea and let AI find the perfect funding match.
        </p>
      </div>
      <QueryInput
        value={query}
        onChange={setQuery}
        canSubmit={!!query.trim()}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        filtersOpen={filtersOpen}
      />
      {filtersOpen ? <OptionalFields filters={filters} onChange={handleFilterChange} /> : null}
    </form>
  );
}
