"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function QueryInput({ value, onChange, disabled }: QueryInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="query" className="sr-only">
        Describe your service idea
      </Label>
      <Textarea
        id="query"
        placeholder="Describe your service idea... (e.g., I want to increase capacity for elderly care services in the Bedok area by 20% over the next 2 years)"
        className="min-h-[120px] text-lg p-4 resize-none shadow-sm focus-visible:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
      />
      <div className="text-xs text-muted-foreground text-right">
        {value.length} characters
      </div>
    </div>
  );
}
