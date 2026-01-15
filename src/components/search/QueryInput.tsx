"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownLeft, SlidersHorizontal } from "lucide-react";

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  canSubmit?: boolean;
  onToggleFilters?: () => void;
  filtersOpen?: boolean;
}

export default function QueryInput({
  value,
  onChange,
  disabled,
  canSubmit,
  onToggleFilters,
  filtersOpen
}: QueryInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="query" className="sr-only">
        Describe your project
      </Label>
      <div className="relative">
        <Textarea
          id="query"
          placeholder="Describe your project..."
          className="min-h-[160px] md:min-h-[200px] text-base md:text-lg p-3 pr-14 pb-14 md:p-4 md:pr-12 md:pb-12 resize-none shadow-sm focus-visible:ring-blue-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
        />
        <button
          type="button"
          className="absolute bottom-2 left-2 md:bottom-3 md:left-3 inline-flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onToggleFilters}
          aria-label="Toggle advanced filters"
          aria-pressed={filtersOpen}
          disabled={disabled}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button
          type="submit"
          className="absolute bottom-2 right-2 md:bottom-3 md:right-3 inline-flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canSubmit || disabled}
          aria-label="Submit query"
        >
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
