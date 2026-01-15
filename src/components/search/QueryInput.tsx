"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownLeft, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isReady = !!canSubmit && !disabled;

  return (
    <div className="space-y-2">
      <Label htmlFor="query" className="sr-only">
        Describe your service idea
      </Label>
      <div className="relative">
        <Textarea
          id="query"
          placeholder="Describe your service idea..."
          className="min-h-[170px] md:min-h-[210px] rounded-2xl border-border/70 bg-card/80 p-4 pr-16 pb-16 text-base md:text-lg shadow-lg shadow-black/5 backdrop-blur-sm focus-visible:border-primary/60 focus-visible:ring-primary/30"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
        />
        <button
          type="button"
          className={cn(
            "absolute bottom-2 left-2 md:bottom-3 md:left-3 inline-flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-border/70 transition-all disabled:cursor-not-allowed disabled:opacity-50",
            filtersOpen
              ? "bg-primary text-primary-foreground shadow-md shadow-black/10"
              : "bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent/70"
          )}
          onClick={onToggleFilters}
          aria-label="Toggle advanced filters"
          aria-pressed={filtersOpen}
          disabled={disabled}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button
          type="submit"
          className={cn(
            "absolute bottom-2 right-2 md:bottom-3 md:right-3 inline-flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-border/70 transition-all disabled:cursor-not-allowed disabled:opacity-50",
            isReady
              ? "bg-primary text-primary-foreground shadow-md shadow-black/10 hover:bg-primary/90"
              : "bg-background text-muted-foreground"
          )}
          disabled={!canSubmit || disabled}
          aria-label="Submit query"
        >
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
