"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ClearHistoryButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear all search history? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/results', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to clear history' }));
        throw new Error(error.error || 'Failed to clear history');
      }

      // Refresh the page to show empty state
      router.refresh();
    } catch (error: any) {
      console.error('Failed to clear history:', error);
      alert('Failed to clear history. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleClear}
      disabled={isLoading}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isLoading ? 'Clearing...' : 'Clear History'}
    </Button>
  );
}
