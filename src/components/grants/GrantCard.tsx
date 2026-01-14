import Link from "next/link";
import { Grant } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, ExternalLink } from "lucide-react";
import { extractFundingAmount, extractDeadline } from "@/lib/utils";

interface GrantCardProps {
  grant: Grant;
}

export default function GrantCard({ grant }: GrantCardProps) {
  const fundingText = extractFundingAmount(grant);
  const deadlineText = extractDeadline(grant);

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          {grant.application_status && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
              {grant.application_status}
            </Badge>
          )}
        </div>
        <CardTitle className="leading-tight mt-2 text-xl">
          {grant.title || "Untitled Grant"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 pt-1">
          {grant.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{fundingText}</span>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{deadlineText}</span>
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
