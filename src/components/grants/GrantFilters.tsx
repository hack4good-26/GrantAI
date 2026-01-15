import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface GrantFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function GrantFilters({ searchTerm, onSearchChange }: GrantFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-serif font-semibold tracking-tight">Browse Grants</h1>
        <p className="text-muted-foreground">
          Explore all available funding opportunities.
        </p>
      </div>
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search grants..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
