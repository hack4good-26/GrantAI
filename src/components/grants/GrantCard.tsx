import Link from "next/link";
import { Grant } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, ExternalLink } from "lucide-react";

interface GrantCardProps {
  grant: Grant;
}

export default function GrantCard({ grant }: GrantCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
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
            <DollarSign className="h-4 w-4 text-primary" />
            <span>
              ${grant.funding_min?.toLocaleString()} - ${grant.funding_max?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
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
  );
}
