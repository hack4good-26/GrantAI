"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings2 } from "lucide-react";

interface OptionalFieldsProps {
  filters: {
    budget: number[];
    duration: number[];
    kpis: number;
  };
  onChange: (key: string, value: any) => void;
}

export default function OptionalFields({ filters, onChange }: OptionalFieldsProps) {
  return (
    <div className="w-full rounded-md border border-input bg-transparent shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground">
        <Settings2 className="h-4 w-4" />
        Advanced Filters (Optional)
      </div>
      <div className="px-6 pb-6 pt-2 space-y-6 animate-in slide-in-from-top-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Estimated Budget Range</Label>
              <span className="text-sm text-muted-foreground">
                ${filters.budget[0].toLocaleString()} - ${filters.budget[1].toLocaleString()}
              </span>
            </div>
            <Slider
              defaultValue={[10000, 100000]}
              max={500000}
              step={5000}
              value={filters.budget}
              onValueChange={(val) => onChange("budget", val)}
              className="py-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Duration (Months)</Label>
                <span className="text-sm text-muted-foreground">{filters.duration[0]} months</span>
              </div>
              <Slider
                defaultValue={[12]}
                max={60}
                step={3}
                value={filters.duration}
                onValueChange={(val) => onChange("duration", val)}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kpis">Number of Key KPIs</Label>
              <Input
                id="kpis"
                type="number"
                min={1}
                max={10}
                value={filters.kpis}
                onChange={(e) => onChange("kpis", parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
