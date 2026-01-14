"use client";

import { useState } from "react";
import { MOCK_GRANTS } from "@/lib/mock-data";
import GrantFilters from "@/components/grants/GrantFilters";
import GrantList from "@/components/grants/GrantList";

export default function GrantsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGrants = MOCK_GRANTS.filter(grant => {
    const search = searchTerm.toLowerCase();
    return (
      (grant.title?.toLowerCase().includes(search)) ||
      (grant.description?.toLowerCase().includes(search)) ||
      (grant.about_grant?.toLowerCase().includes(search)) ||
      (grant.who_can_apply?.toLowerCase().includes(search)) ||
      (grant.funding_info?.toLowerCase().includes(search)) ||
      (grant.full_description?.toLowerCase().includes(search)) ||
      (grant.application_status?.toLowerCase().includes(search))
    );
  });

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8">
      <GrantFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <GrantList grants={filteredGrants} />
    </div>
  );
}
