import { Grant } from "@/lib/types";
import GrantCard from "./GrantCard";

interface GrantListProps {
  grants: Grant[];
}

export default function GrantList({ grants }: GrantListProps) {
  if (grants.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No grants found matching your search.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {grants.map((grant) => (
        <GrantCard key={grant.id} grant={grant} />
      ))}
    </div>
  );
}
