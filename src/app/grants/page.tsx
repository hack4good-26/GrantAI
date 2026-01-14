"use client";

import { useState, useEffect } from "react";
import GrantFilters from "@/components/grants/GrantFilters";
import GrantList from "@/components/grants/GrantList";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { Grant } from "@/lib/types";

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('/api/grants')
      .then(res => res.json())
      .then(data => {
        // Handle error responses from API
        if (Array.isArray(data)) {
          setGrants(data);
        } else {
          console.error('API returned non-array response:', data);
          setGrants([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching grants:', error);
        setGrants([]);
        setLoading(false);
      });
  }, []);

  const filteredGrants = grants.filter(grant => {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8">
      <GrantFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <GrantList grants={filteredGrants} />
    </div>
  );
}
