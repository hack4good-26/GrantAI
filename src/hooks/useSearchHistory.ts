import { useState, useEffect } from 'react';
import type { ServiceIdea } from '@/lib/types';
import { serviceIdeasApi } from '@/lib/api';

/**
 * Hook to manage search history (past service ideas/searches)
 * Can use API or localStorage for persistence
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<ServiceIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch history from API
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const ideas = await serviceIdeasApi.getAll();
      // Sort by created_at descending (most recent first)
      const sorted = ideas.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setHistory(sorted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch history'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const addToHistory = (serviceIdea: ServiceIdea) => {
    setHistory((prev) => [serviceIdea, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    loading,
    error,
    addToHistory,
    clearHistory,
    refresh: fetchHistory,
  };
}
