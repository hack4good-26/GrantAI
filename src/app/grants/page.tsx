"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_GRANTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, DollarSign, ExternalLink } from "lucide-react";

export default function GrantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredGrants = MOCK_GRANTS.filter(grant => 
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Grants</h1>
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGrants.map((grant) => (
          <Card key={grant.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <Badge variant="outline">{grant.source}</Badge>
                {grant.status === 'ACTIVE' && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Active</Badge>
                )}
              </div>
              <CardTitle className="leading-tight mt-2 text-xl">
                {grant.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {grant.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    ${grant.funding_min?.toLocaleString()} - ${grant.funding_max?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {new Date(grant.deadline || "").toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Link href={`/grants/${grant.id}`} className="w-full">
                <Button variant="outline" className="w-full group">
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredGrants.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No grants found matching your search.
        </div>
      )}
    </div>
  );
}
