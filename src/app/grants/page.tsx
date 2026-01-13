"use client";

import { useState } from "react";
import { MOCK_GRANTS } from "@/lib/mock-data";
import GrantFilters from "@/components/grants/GrantFilters";
import GrantList from "@/components/grants/GrantList";

export default function GrantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredGrants = MOCK_GRANTS.filter(grant => 
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8">
      <GrantFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <GrantList grants={filteredGrants} />
    </div>
  );
}
