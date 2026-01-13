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
    
    // Simulate API call and vector search
    setTimeout(() => {
      // Mock creating a service idea ID (e.g., 101)
      const mockId = 101;
      router.push(`/matches?id=${mockId}`);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <LoadingSpinner text="Analyzing your service idea and finding suitable grants..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          What service grants are you looking for?
        </h1>
        <p className="text-muted-foreground text-base">
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
