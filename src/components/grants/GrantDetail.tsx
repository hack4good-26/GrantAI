import { Grant } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  ExternalLink 
} from "lucide-react";

interface GrantDetailProps {
  grant: Grant;
}

export default function GrantDetail({ grant }: GrantDetailProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{grant.source}</Badge>
          <Badge className="bg-green-100 text-green-800 border-none">Active</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {grant.title}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {grant.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <DollarSign className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Funding Amount</div>
            <div className="font-bold text-lg mt-1">
              ${grant.funding_min?.toLocaleString()} - ${grant.funding_max?.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Application Deadline</div>
            <div className="font-bold text-lg mt-1">
              {new Date(grant.deadline || "").toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Project Duration</div>
            <div className="font-bold text-lg mt-1">
              {grant.duration_months} Months
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-2xl font-bold mb-3">Eligibility & Requirements</h3>
          <div className="prose max-w-none text-gray-700">
            <p>
              To be eligible for this grant, applicants must be registered non-profit organizations or social enterprises. 
              Projects must demonstrate clear community impact and alignment with national strategic goals.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Registered charity or IPC status</li>
              <li>At least 2 years of operational history</li>
              <li>Clear project timeline and budget breakdown</li>
              <li>Measurable outcome indicators</li>
            </ul>
          </div>
        </section>

        <Separator />

        <section>
          <h3 className="text-2xl font-bold mb-3">Key Performance Indicators (KPIs)</h3>
          <div className="prose max-w-none text-gray-700">
            <p>Successful applicants will be expected to track and report on the following metrics:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Number of beneficiaries reached</li>
              <li>Percentage improvement in beneficiary well-being</li>
              <li>Cost efficiency per beneficiary</li>
              <li>Sustainability metrics post-funding</li>
            </ul>
          </div>
        </section>
        
        <div className="pt-4">
          <Button size="lg" className="w-full md:w-auto">
            Visit Official Grant Portal
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
